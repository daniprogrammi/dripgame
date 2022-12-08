import { render, screen } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import Navbar from '../../../components/Navbar/Navbar';

describe('the navbar', () => {

    test("it renders the navbar component", () => {
        const tree = render(<Navbar />, { wrapper: BrowserRouter });
        expect(tree).toMatchSnapshot();
    })

    test("only current page is active", () => {
        render(<Navbar />, { wrapper: BrowserRouter });
        expect(screen.getByText('Home')).toHaveClass('active')
        expect(screen.getByText('About')).not.toHaveClass('active')
    })
})