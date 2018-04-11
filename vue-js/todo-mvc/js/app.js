/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	let filters = {
		all: function (todos) {
			return todos;
		},
		active: function (todos) {
			return todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		completed: function (todos) {
			return todos.filter(function (todo) {
				return todo.completed;
			});
		}
	};

	let data = {
		todos: todoStorage.fetch(),
		newTodo: '',
		editingTodo: null,
		visibility: 'all'
	};

	Vue.component('todo-list', Vue.extend({
		template: '#todo-list-template',

		data : function() {
			return data;
		},
		
		computed: {
			filteredTodos: function () {
				return filters[this.visibility](this.todos);
			},
			allDone: {
				get: function () {
					return this.remaining === 0;
				},
				set: function (value) {
					this.todos.forEach(function (todo) {
						todo.completed = value;
					});
				}
			}
		},

		methods: {
			removeTodo: function (todo) {
				let index = this.todos.indexOf(todo);
				this.todos.splice(index, 1);
			},

			editTodo: function (todo) {
				this.beforeEditCache = todo.title;
				this.editingTodo = todo;
			},

			doneEdit: function (todo) {
				if (!this.editingTodo) {
					return;
				}
				this.editingTodo = null;
				todo.title = todo.title.trim();
				if (!todo.title) {
					this.removeTodo(todo);
				}
			},

			cancelEdit: function (todo) {
				this.editingTodo = null;
				todo.title = this.beforeEditCache;
			}
		},

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/custom-directive.html
		directives: {
			'todo-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}

	}));

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.todoapp',

		// app initial state
		data : function() {
			return data;
		},

		// 當 todos 變數改變時，呼叫 localStorage 做存儲
		watch: {
			todos: {
				deep: true,
				handler: todoStorage.save
			}
		},

		// 當相依 data 一變，computed 結果也會隨之更新（不變時會 cache）
		// http://vuejs.org/guide/computed.html
		computed: {
			remaining: function () {
				return filters.active(this.todos).length;
			}
		},

		// 處理資料的邏輯處理，注意這裡都不會去變更 DOM 的部分
		methods: {
			addTodo: function () {
				let value = this.newTodo && this.newTodo.trim();
				if (!value) {
					return;
				}
				this.todos.push({ title: value, completed: false });
				this.newTodo = '';
			},

			pluralize: function (count) {
				return (count === 1 ? '只' : '還') + '剩下';
			},

			removeCompleted: function () {
				this.todos = filters.active(this.todos);
			}
		}
	});

})(window);
