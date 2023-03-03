import { ActionButton } from "../buttons/actionButton.js";
import { Menu } from "./menu.js";

export class FileMenu extends Menu {
    public constructor(innerElement: HTMLDivElement, newButton: ActionButton, openButton: ActionButton, saveButton: ActionButton) {
        super(innerElement, newButton, openButton, saveButton);

        // Register listeners to the button events
        newButton.setOnClick(() => this.handleNewButtonClick());
        openButton.setOnClick(() => this.handleOpenButtonClick());
        saveButton.setOnClick(() => this.handleSaveButtonClick());
    }

    /**
     * The method to handle the new button being clicked.
     */
    private handleNewButtonClick(): void {
        alert('file > new');
    }

    /**
     * The method to handle the open button being clicked.
     */
    private handleOpenButtonClick(): void {
        alert('file > open');
    }

    /**
     * The method to handle the save button being clicked.
     */
    private handleSaveButtonClick(): void {
        alert('file > save');
    }
}