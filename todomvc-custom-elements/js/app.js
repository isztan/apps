(function(window) {
  document.register('todo-item', {
    extends: 'li',
    prototype: Object.create(HTMLLIElement.prototype, {
      readyCallback: {
        value: function() {
          if (this.className === 'completed') {
            this.completed = true;
          }
          this.checkbox = this.querySelector('input[type=checkbox]');
          this.checkbox.checked = this.completed;
          this.checkbox.addEventListener('click', this.toggleCompleted.bind(this));
          this.destroyBtn = this.querySelector('button.destroy');
          this.destroyBtn.addEventListener('click', this.remove.bind(this));
          this.label = this.querySelector('label');
          this.label.addEventListener('dblclick', this.startEditing.bind(this));
          this.input = this.querySelector('input.edit');
          this.input.addEventListener('blur', this.stopEditing.bind(this));
        }
      },
      toggleCompleted: {
        value: function() {
          this.completed = !this.completed;
          if (this.completed) {
            this.className = 'completed';
          } else {
            this.className = '';
          }
          if (this.checkbox) {
            this.checkbox.checked = this.completed;
          }
        }
      },
      startEditing: {
        value: function() {
          if (this.completed) {
            return;
          }
          this.input.value = this.label.textContent;
          this.className = 'editing';
          this.input.focus();
        }
      },
      stopEditing: {
        value: function() {
          this.label.textContent = this.input.value;
          this.className = '';
        }
      }
    })
  });
  document.register('todo-item-input', {
    extends: 'input',
    prototype: Object.create(HTMLInputElement.prototype, {
      readyCallback: {
        value: function() {
          this.addEventListener('keypress', function(e) {
            if (e.keyCode == 13) {
              var e = document.createEvent('HTMLEvents');
              e.initEvent('todoadd', true, false);
              this.dispatchEvent(e);
            }
          });
        }
      },
      reset: {
        value: function() {
          this.value = '';
          this.blur();
        }
      }
    })
  });
  document.register('todo-app', {
    extends: 'section',
    prototype: Object.create(HTMLElement.prototype, {
      readyCallback: {
        value: function() {
          this.list = this.querySelector('ul#todo-list');
          this.addInput = this.querySelector('input#new-todo');
          this.addInput.addEventListener('todoadd', this.addItem.bind(this));
        },
      },
      addItem: {
        value: function(e) {
          var input = e.srcElement;
          var html = '<li is="todo-item"><div class="view"><input class="toggle" type="checkbox"><label>' + input.value + '</label><button class="destroy"></button></div><input class="edit"></li>'
          var el = document.createElement();
          el.innerHTML = html;
          var todo = el.querySelector('li');
          document.upgradeElement(todo);
          if (this.list.childNodes.length) {
            this.list.insertBefore(todo, this.list.childNodes[0]);
          } else {
            this.list.appendChild(todo);
          }
          input.reset();
        }
      }
    })
  });
})(window);
