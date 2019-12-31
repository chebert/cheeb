function label(innerHTML) {
  var l = document.createElement('LABEL');
  l.innerHTML = innerHTML;
  return l;
}
// onSubmit is called when Ctrl+Enter is pressed.
function textArea(onSubmit) {
  var l = document.createElement('TEXTAREA');
  l.setAttribute('rows', 5);
  l.setAttribute('cols', 80);
  if (onSubmit) {
    l.onkeydown = function (e) {
      if (e.code == "Enter" && e.ctrlKey) {
        onSubmit(l);
      }
    }
  }
  return l;
}
function br() {
  return document.createElement('BR');
}

function appendChildren(parent, children) {
  for (var i = 0; i < children.length; ++i)
    parent.appendChild(children[i]);
}

// Turn off default right click behavior.
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
})

function evaluateInput(input, state) {
  state.stack.push(3);
  state.stack.push(3);
  state.stack.push(3);
}

function stackText(state) {
  var t = "";
  for (var i = 0; i < state.stack.length; ++i)
    t += state.stack[i].toString() + ' ';
  return t;
}

window.onload = function () {
  var outputLabel;
  var state = {
    stack: [],
    dict: {}
  };

  appendChildren(document.body, [
    textArea(function (ta) {
      evaluateInput(ta.value, state);
      outputLabel.innerHTML = stackText(state);
      ta.value = '';
    }),
    br(),
    outputLabel = label('Hello, cheeb')
  ]);
};
