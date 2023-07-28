import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { App } from '../src/App'
import React from 'react'
import '@testing-library/jest-dom'

test('Renders main page correctly', async () => {
  render(<App />)
  await act(async () => {
    const title = screen.getByText(/Haig Fras Digital Twin/i)
    expect(true).toBeTruthy()
    expect(title).toBeInTheDocument()
  })
})

test('Close popup', async () => {
  render(<App />)
  await act(async () => {
    const button = screen.getByTitle('Close')
    fireEvent.click(button)
    // await waitForElementToBeRemoved(button)
    expect(screen.getByText(/Haig Fras Digital Twin/i)).toBeInTheDocument()
    // expect(screen.getByText(/Haig Fras Digital Twin/i)).toBeNull()
  })
})

// test('Close popup', () => {
//   expect(true).toBeTruthy()
//   expect(container.getElementsByClassName('fa-circle-xmark').length).toBe(1)
// })

// test('Renders main page correctly', async () => {
//   render(<App />);
//   const buttonCount = await screen.findByRole('button');
//   expect(buttonCount.innerHTML).toBe('count is: 0');
//   expect(true).toBeTruthy();
// });
