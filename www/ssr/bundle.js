var app = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function isPromise(value) {
		return value && typeof value.then === 'function';
	}

	function callAfter(fn, i) {
		if (i === 0) fn();
		return () => {
			if (!--i) fn();
		};
	}

	function addLoc(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		fn();
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
		node.removeEventListener(event, handler, options);
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function setStyle(node, key, value) {
		node.style.setProperty(key, value);
	}

	function handlePromise(promise, info) {
		var token = info.token = {};

		function update(type, index, key, value) {
			if (info.token !== token) return;

			info.resolved = key && { [key]: value };

			const child_ctx = assign(assign({}, info.ctx), info.resolved);
			const block = type && (info.current = type)(info.component, child_ctx);

			if (info.block) {
				if (info.blocks) {
					info.blocks.forEach((block, i) => {
						if (i !== index && block) {
							block.o(() => {
								block.d(1);
								info.blocks[i] = null;
							});
						}
					});
				} else {
					info.block.d(1);
				}

				block.c();
				block[block.i ? 'i' : 'm'](info.mount(), info.anchor);

				info.component.root.set({}); // flush any handlers that were created
			}

			info.block = block;
			if (info.blocks) info.blocks[index] = block;
		}

		if (isPromise(promise)) {
			promise.then(value => {
				update(info.then, 1, info.value, value);
			}, error => {
				update(info.catch, 2, info.error, error);
			});

			// if we previously had a then/catch block, destroy it
			if (info.current !== info.pending) {
				update(info.pending, 0);
				return true;
			}
		} else {
			if (info.current !== info.then) {
				update(info.then, 1, info.value, promise);
				return true;
			}

			info.resolved = { [info.value]: promise };
		}
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function destroyDev(detach) {
		destroy.call(this, detach);
		this.destroy = function() {
			console.warn('Component was already destroyed');
		};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function setDev(newState) {
		if (typeof newState !== 'object') {
			throw new Error(
				this._debugName + '.set was called without an object of data key-values to update.'
			);
		}

		this._checkReadOnly(newState);
		set.call(this, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	var protoDev = {
		destroy: destroyDev,
		get,
		fire,
		on,
		set: setDev,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	/* ui\tags\Loading.html generated by Svelte v2.16.0 */

	function data(e) {
		return {small: false, big: false};
	}

	const file = "ui\\tags\\Loading.html";

	function create_main_fragment(component, ctx) {
		var div8, div7, div6, div1, div0, text0, div3, div2, text1, div5, div4, div7_class_value, current;

		return {
			c: function create() {
				div8 = createElement("div");
				div7 = createElement("div");
				div6 = createElement("div");
				div1 = createElement("div");
				div0 = createElement("div");
				text0 = createText("\r\n        ");
				div3 = createElement("div");
				div2 = createElement("div");
				text1 = createText("\r\n        ");
				div5 = createElement("div");
				div4 = createElement("div");
				div0.className = "circle";
				addLoc(div0, file, 4, 12, 246);
				div1.className = "circle-clipper left";
				addLoc(div1, file, 3, 8, 199);
				div2.className = "circle";
				addLoc(div2, file, 6, 12, 325);
				div3.className = "gap-patch";
				addLoc(div3, file, 5, 14, 288);
				div4.className = "circle";
				addLoc(div4, file, 8, 12, 415);
				div5.className = "circle-clipper right";
				addLoc(div5, file, 7, 14, 367);
				div6.className = "spinner-layer spinner-yellow-only";
				addLoc(div6, file, 2, 8, 142);
				div7.className = div7_class_value = "preloader-wrapper " + (ctx.small ? "small" : ctx.big ? "big" : "") + " active";
				addLoc(div7, file, 1, 4, 57);
				div8.className = "center-align";
				setStyle(div8, "padding-top", "25%");
				addLoc(div8, file, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div8, anchor);
				append(div8, div7);
				append(div7, div6);
				append(div6, div1);
				append(div1, div0);
				append(div1, text0);
				append(div6, div3);
				append(div3, div2);
				append(div3, text1);
				append(div6, div5);
				append(div5, div4);
				current = true;
			},

			p: function update(changed, ctx) {
				if ((changed.small || changed.big) && div7_class_value !== (div7_class_value = "preloader-wrapper " + (ctx.small ? "small" : ctx.big ? "big" : "") + " active")) {
					div7.className = div7_class_value;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div8);
				}
			}
		};
	}

	function Loading(options) {
		this._debugName = '<Loading>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign(data(), options.data);
		if (!('small' in this._state)) console.warn("<Loading> was created without expected data property 'small'");
		if (!('big' in this._state)) console.warn("<Loading> was created without expected data property 'big'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Loading.prototype, protoDev);

	Loading.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* ui\ssr\dynamic.html generated by Svelte v2.16.0 */

	function getPage() {
	    return document.getElementById("dynamic").getAttribute("page");
	}

	function data$1() {
	    return {
	        getcomments:
	            fetch(`/comment/getAllRelToAPage/${getPage()}`)
	                .then(response => {
	                        return response.json()
	                    })
	                .then(response => {
	                    return response.body
	                })
	    }
	}
	var methods = {
	    post() {
	        const elname = document.getElementById("name");
	        const elemail = document.getElementById("email");
	        const elcontent = document.getElementById("content");

	        const name = elname.value ? elname.value : null;
	        const email = elemail.value ? elemail.value : null;
	        const content = elcontent.value ? elcontent.value : null;
	        if(!name || !email || !content){
	            alert("لطفا تمامی فیلد هارا پر کنید!");
	        } else{
	            const comment = {
	            "name" : name,
	            "email" : email,
	            "content" : content,
	            "page_id" : getPage()
	        };
	        fetch("/comment/add", {
	                method: "POST",
	                mode: "same-origin",
	                credentials: "same-origin",
	                headers: {
	                    "Content-Type": "application/json"
	                },
	                redirect: "follow",
	                body: JSON.stringify(comment)
	            }).then(res => {
	                if(res.status != 200){
	                    alert("لطفا برای ثبت پیام دوباره تلاش کنید!");
	                } else{
	                    alert("پیام شما بعد از تایید توسط ادمین نشان داده خواهد شد.");
	                }
	            })
	        .catch(err => alert("خطا در سرور!"));
	        }
	        
	    }
	};

	const file$1 = "ui\\ssr\\dynamic.html";

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.cmnt = list[i];
		return child_ctx;
	}

	function create_main_fragment$1(component, ctx) {
		var div0, promise, text0, div5, div4, form, div1, label0, text2, input0, text3, div2, label1, text5, input1, text6, div3, label2, text8, textarea, text9, input2, current;

		let info = {
			component,
			ctx,
			current: null,
			pending: create_pending_block,
			then: create_then_block,
			catch: create_catch_block,
			value: 'comments',
			error: 'err',
			blocks: Array(3)
		};

		handlePromise(promise = ctx.getcomments, info);

		function click_handler(event) {
			component.post();
		}

		return {
			c: function create() {
				div0 = createElement("div");

				info.block.c();

				text0 = createText("\r\n\r\n");
				div5 = createElement("div");
				div4 = createElement("div");
				form = createElement("form");
				div1 = createElement("div");
				label0 = createElement("label");
				label0.textContent = "Email";
				text2 = createText("\r\n                ");
				input0 = createElement("input");
				text3 = createText("\r\n            ");
				div2 = createElement("div");
				label1 = createElement("label");
				label1.textContent = "Name";
				text5 = createText("\r\n                ");
				input1 = createElement("input");
				text6 = createText("\r\n            ");
				div3 = createElement("div");
				label2 = createElement("label");
				label2.textContent = "Content";
				text8 = createText("\r\n                ");
				textarea = createElement("textarea");
				text9 = createText("\r\n            ");
				input2 = createElement("input");
				div0.id = "comments";
				div0.className = "container text-center en border border-primary rounded";
				setStyle(div0, "font-size", "1vw");
				setStyle(div0, "color", "black");
				setStyle(div0, "margin-top", "5%");
				setStyle(div0, "margin-bottom", "5%");
				setStyle(div0, "direction", "rtl");
				setStyle(div0, "padding", "2%");
				addLoc(div0, file$1, 2, 0, 4);
				label0.htmlFor = "email";
				label0.className = "sr-only";
				addLoc(label0, file$1, 28, 16, 890);
				setAttribute(input0, "type", "email");
				input0.className = "form-control";
				input0.id = "email";
				input0.placeholder = "email";
				addLoc(input0, file$1, 29, 16, 956);
				div1.className = "form-group mb-2";
				addLoc(div1, file$1, 27, 12, 843);
				label1.htmlFor = "name";
				label1.className = "sr-only";
				addLoc(label1, file$1, 32, 16, 1117);
				setAttribute(input1, "type", "text");
				input1.className = "form-control";
				input1.id = "name";
				input1.placeholder = "name";
				addLoc(input1, file$1, 33, 16, 1181);
				div2.className = "form-group mx-sm-3 mb-2";
				addLoc(div2, file$1, 31, 12, 1062);
				label2.htmlFor = "name";
				label2.className = "sr-only";
				addLoc(label2, file$1, 36, 16, 1339);
				textarea.id = "content";
				textarea.className = "form-control";
				textarea.placeholder = "content";
				addLoc(textarea, file$1, 37, 16, 1406);
				div3.className = "form-group mx-sm-3 mb-2";
				addLoc(div3, file$1, 35, 12, 1284);
				addListener(input2, "click", click_handler);
				setAttribute(input2, "type", "button");
				input2.className = "btn btn-primary mb-2";
				input2.value = "post";
				addLoc(input2, file$1, 39, 12, 1517);
				form.className = "form-inline";
				addLoc(form, file$1, 26, 8, 803);
				div4.className = "card-body";
				addLoc(div4, file$1, 25, 4, 770);
				div5.className = "card";
				setStyle(div5, "width", "18rem");
				addLoc(div5, file$1, 24, 0, 724);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);

				info.block.i(div0, info.anchor = null);
				info.mount = () => div0;
				info.anchor = null;

				insert(target, text0, anchor);
				insert(target, div5, anchor);
				append(div5, div4);
				append(div4, form);
				append(form, div1);
				append(div1, label0);
				append(div1, text2);
				append(div1, input0);
				append(form, text3);
				append(form, div2);
				append(div2, label1);
				append(div2, text5);
				append(div2, input1);
				append(form, text6);
				append(form, div3);
				append(div3, label2);
				append(div3, text8);
				append(div3, textarea);
				append(form, text9);
				append(form, input2);
				current = true;
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				info.ctx = ctx;

				if (('getcomments' in changed) && promise !== (promise = ctx.getcomments) && handlePromise(promise, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				const countdown = callAfter(outrocallback, 3);
				for (let i = 0; i < 3; i += 1) {
					const block = info.blocks[i];
					if (block) block.o(countdown);
					else countdown();
				}

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div0);
				}

				info.block.d();
				info = null;

				if (detach) {
					detachNode(text0);
					detachNode(div5);
				}

				removeListener(input2, "click", click_handler);
			}
		};
	}

	// (19:0) {:catch err}
	function create_catch_block(component, ctx) {
		var p, text0, text1_value = ctx.err.message, text1, current;

		return {
			c: function create() {
				p = createElement("p");
				text0 = createText("Error ");
				text1 = createText(text1_value);
				addLoc(p, file$1, 19, 4, 674);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if ((changed.getcomments) && text1_value !== (text1_value = ctx.err.message)) {
					setData(text1, text1_value);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	// (7:0) {:then comments}
	function create_then_block(component, ctx) {
		var each_anchor, current;

		var each_value = ctx.comments;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_anchor = createComment();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.getcomments) {
					each_value = ctx.comments;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div0, each_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(each_anchor);
				}
			}
		};
	}

	// (9:8) {#if cmnt.status === 1}
	function create_if_block(component, ctx) {
		var div2, div0, text0_value = ctx.cmnt.name, text0, text1, text2_value = ctx.cmnt.email, text2, text3, div1, p, text4_value = ctx.cmnt.content, text4, text5, hr;

		return {
			c: function create() {
				div2 = createElement("div");
				div0 = createElement("div");
				text0 = createText(text0_value);
				text1 = createText(" - ");
				text2 = createText(text2_value);
				text3 = createText("\r\n                ");
				div1 = createElement("div");
				p = createElement("p");
				text4 = createText(text4_value);
				text5 = createText("\r\n            ");
				hr = createElement("hr");
				div0.className = "card-header";
				addLoc(div0, file$1, 10, 16, 405);
				p.className = "card-text";
				addLoc(p, file$1, 12, 20, 525);
				div1.className = "card-body";
				addLoc(div1, file$1, 11, 16, 480);
				div2.className = "card border-primary mb-3";
				setStyle(div2, "max-width", "18rem");
				addLoc(div2, file$1, 9, 12, 323);
				addLoc(hr, file$1, 15, 12, 622);
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				append(div0, text0);
				append(div0, text1);
				append(div0, text2);
				append(div2, text3);
				append(div2, div1);
				append(div1, p);
				append(p, text4);
				insert(target, text5, anchor);
				insert(target, hr, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.getcomments) && text0_value !== (text0_value = ctx.cmnt.name)) {
					setData(text0, text0_value);
				}

				if ((changed.getcomments) && text2_value !== (text2_value = ctx.cmnt.email)) {
					setData(text2, text2_value);
				}

				if ((changed.getcomments) && text4_value !== (text4_value = ctx.cmnt.content)) {
					setData(text4, text4_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div2);
					detachNode(text5);
					detachNode(hr);
				}
			}
		};
	}

	// (8:4) {#each comments as cmnt}
	function create_each_block(component, ctx) {
		var if_block_anchor;

		var if_block = (ctx.cmnt.status === 1) && create_if_block(component, ctx);

		return {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (ctx.cmnt.status === 1) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block(component, ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			d: function destroy$$1(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (5:20)           <Loading big/>  {:then comments}
	function create_pending_block(component, ctx) {
		var current;

		var loading_initial_data = { big: true };
		var loading = new Loading({
			root: component.root,
			store: component.store,
			data: loading_initial_data
		});

		return {
			c: function create() {
				loading._fragment.c();
			},

			m: function mount(target, anchor) {
				loading._mount(target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (loading) loading._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				loading.destroy(detach);
			}
		};
	}

	function Dynamic(options) {
		this._debugName = '<Dynamic>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign(data$1(), options.data);
		if (!('getcomments' in this._state)) console.warn("<Dynamic> was created without expected data property 'getcomments'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$1(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Dynamic.prototype, protoDev);
	assign(Dynamic.prototype, methods);

	Dynamic.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	const app = new Dynamic({
		target: document.getElementById("dynamic"),
		data: {}
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
