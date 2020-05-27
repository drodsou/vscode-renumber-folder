// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// console.log('-- Congratulations, your extension "renumber-folder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('renumber-folder.renumber-folder', function () {

		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from renumber-folder!');
		let folder
		try {
			folder = path.dirname(vscode.window.activeTextEditor.document.uri.fsPath);
		} catch (e) {
			vscode.window.showErrorMessage("ERROR: No file selected");	
			return; 
		}

		if (folder === '.') { 
			vscode.window.showErrorMessage("ERROR: Unsaved file");	
			return; 
		}

		vscode.window.showInformationMessage(`Renumbering ${folder}`)
		renumberFolder(folder);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

/**
 * Renames files/directories of folder assigning correlative 00# prefix
*/
function renumberFolder(folder, padWidth=2) {

	let files = fs.readdirSync(folder)

	files.forEach( (f,i)=>{
    let curIndex = f.split('#')[0];
    let newIndex = `${i+1}`.padStart(padWidth,"0");
    
    if (newIndex !== curIndex) {
			let newFile = newIndex + '#' + f.replace(/[^#]+#/,"");
      fs.renameSync(folder + '/' + f, folder + '/' + newFile);
    }
  })
}
