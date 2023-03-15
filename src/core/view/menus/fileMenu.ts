import { ActionButton } from "../buttons/actionButton.js";
import { Menu } from "./menu.js";

export class FileMenu extends Menu {
    private _newButton: ActionButton;
    private _openButton: ActionButton;
    private _saveButton: ActionButton;

    private _newButtonClickEventHandler: () => void;
    private _openButtonClickEventHandler: () => void;
    private _saveButtonClickEventHandler: () => void;

    public constructor(innerElement: HTMLDivElement, newButton: ActionButton, openButton: ActionButton, saveButton: ActionButton) {
        super(innerElement, newButton, openButton, saveButton);

        this._newButtonClickEventHandler = () => this._handleNewButtonClick();
        this._openButtonClickEventHandler = () => this._handleOpenButtonClick();
        this._saveButtonClickEventHandler = () => this._handleSaveButtonClick();
        
        this._newButton = newButton;
        this._openButton = openButton;
        this._saveButton = saveButton;

        // Register listeners to the button events
        this._newButton.addEventListener('pressed', this._newButtonClickEventHandler);
        this._openButton.addEventListener('pressed', this._openButtonClickEventHandler);
        this._saveButton.addEventListener('pressed', this._saveButtonClickEventHandler);
    }

    public dispose(): void {
        this._newButton.removeEventListener('pressed', this._newButtonClickEventHandler);
        this._openButton.removeEventListener('pressed', this._openButtonClickEventHandler);
        this._saveButton.removeEventListener('pressed', this._saveButtonClickEventHandler);
        super.dispose();
    }

    /**
     * The method to handle the new button being clicked.
     */
    private _handleNewButtonClick(): void {
        alert('file > new');
    }

    /**
     * The method to handle the open button being clicked.
     */
    private _handleOpenButtonClick(): void {
        alert('file > open');
    }

    /**
     * The method to handle the save button being clicked.
     */
    private _handleSaveButtonClick(): void {
        alert('file > save');
    }
}