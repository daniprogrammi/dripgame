import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { within } from '@testing-library/dom'
import '@testing-library/jest-dom'

import UploadForm from "../../../components/UploadForm/UploadForm";

/*
TODO: Write negative test cases
TODO: Write form submit test/validation at some point
*/
describe('the upload form', () => {
    test("it renders the upload form component", () => {
        const tree = render(<UploadForm />, { wrapper: BrowserRouter });
        expect(tree).toMatchSnapshot();
    })

    test('it provides a dropdown for the asset category', () => {
        // get by role asset-category / combobox
        render(<UploadForm />, { wrapper: BrowserRouter });
        userEvent.selectOptions(screen.getByTestId("asset-category-select"), 'bottoms');
        const dropdown = within(screen.getByTestId("asset-category-select"));
        expect((dropdown.getByRole('option', { name: 'Bottoms' })).selected).toBeTruthy;
        expect((dropdown.getByRole('option', { name: 'Tops' })).selected).not.toBeTruthy;
    })

    test('it provides a text area we can fill out', async () => {
        render(<UploadForm />, { wrapper: BrowserRouter });
        const description = screen.getByTestId("asset-extra");
        fireEvent.change(description, { target: { value: 'Testing we can type in the textbox' } });
        expect(description).toHaveValue('Testing we can type in the textbox')
    })
})