// Create a label with its contents filled in.
function label(innerHTML) {
  var l = document.createElement('LABEL');
  l.innerHTML = innerHTML;
  return l;
}

// Create a textArea with a callback:
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
// Line break element.
function br() {
  return document.createElement('BR');
}

// Append children to the DOM element parent.
function appendChildren(parent, children) {
  for (var i = 0; i < children.length; ++i)
    parent.appendChild(children[i]);
}

// Turn off default right click behavior.
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Split the string in two: before idx and after idx.
function splitStringAt(str, idx) {
  return [str.substring(0, idx), str.substring(idx + 1)];
}

// Find the first index of array that matchFn returns true
// or -1.
function findIf(array, matchFn) {
  for (var i = 0; i < array.length; ++i) {
    if (matchFn(array[i])) {
      return i;
    }
  }
  return -1;
}

// Parse input string until a match occurs.
// Return [parsed, unparsed].
function parse(input, matchFn) {
  var idx = findIf(input, matchFn);
  return idx === -1 ? [input, ''] : splitStringAt(input, idx);
}

// True if ch is a whitespace character.
function isWhiteSpace(ch) { return ' \t\n\r\v'.indexOf(ch) > -1; }

// Parse a space-delimited word from input.
function parseWord(input) {
  return parse(input, isWhiteSpace);
}

// Try converting word to a number.
// Return null if NaN.
function wordToNumber(word) {
  var res = Number(word);
  if (isNaN(res)) {
    return null;
  }
  return res;
}

// Find the word in the dictionary.
function findWord(state, word) {
  var upWord = word.toUpperCase();
  for (var idx = state.dict.length-1; idx >= 0; idx--) {
    if (state.dict[idx].name === upWord) {
      return state.dict[idx];
    }
  }
  return null;
}

// The state of the VM.
var state;

// Evaluate the given word.
// If it's a number, push it on the stack.
// If it's a word, execute it's meaning.
// Otherwise, show a warning in the console.
function evaluateWord(word) {
  var num = wordToNumber(word);
  var entry;
  if (num !== null) {
    state.stack.push(num);
  } else if ((entry = findWord(state, word)) !== null) {
    entry.fn();
  } else {
    console.warn("Could not find word: " + word);
  }
}

// Evaluate the given chunk of input.
function evaluateInput(input) {
  var rest = input;
  while (rest !== '') {
    var res = parseWord(rest);
    rest = res[1];
    evaluateWord(res[0]);
  }
}

// Return a textual representation of the stack.
function stackText() {
  if (state.stack.length === 0) return '[ ]';
  var t = "[ ";
  for (var i = state.stack.length-1; i >= 0; --i)
    t += state.stack[i].toString() + ' ';
  return t + ' ]';
}

// Return the last element of an array, or null if array is empty.
function last(array) {
  return array.length > 0 ? array[array.length - 1] : null;
}

// Pop the top element off the stack.
function pop() {
  if (state.stack.length === 0) {
    console.warn("Stack underflow");
  }
  return state.stack.pop();
}
// Push the value onto the stack.
function push(val) { state.stack.push(val); }

// Duplicate the top element of the stack.
function dup() {
  push(last(state.stack));
}
// Swap the top two elements of the stack.
function swap() {
  var b = pop();
  var a = pop();
  push(b);
  push(a);
}
// Swap the top two elements of the stack.
function rot() {
  var c = pop();
  var b = pop();
  var a = pop();
  push(c);
  push(a);
  push(b);
}

window.onload = function () {
  var outputLabel;
  state = {
    stack: [],
    dict: [
      { name: 'DUP', fn: dup },
      { name: 'SWAP', fn: swap },
      { name: 'DROP', fn: pop },
      { name: 'ROT', fn: rot },
      { name: '+', fn: function() { push(pop() + pop()); } },
      { name: '-', fn: function() {
          var b = pop();
          var a = pop();
          push(a - b);
        }
      },
      { name: '*', fn: function() { push(pop() * pop()); } },
      { name: '/', fn: function() {
          var b = pop();
          var a = pop();
          push(a / b);
        }
      },
    ]
  };

  appendChildren(document.body, [
    textArea(function (ta) {
      evaluateInput(ta.value, state);
      outputLabel.innerHTML = stackText(state);
      ta.value = '';
    }),
    br(),
    outputLabel = label(stackText(state))
  ]);
};
