I.Exception = function Exception(code) {
    this.code = code;
    this.message = I.ExceptionCodes[code];
    //dialogView.renderException({ errorMessage: 'Exception ' + code + ': ' + this.message });
    console.error(this);
};
