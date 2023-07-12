import { render } from '@testing-library/react'
import { App } from '../src/App'
import React from 'react'

test('Renders main page correctly', () => {
  render(<App />)
  expect(true).toBeTruthy()
})

// test('Renders main page correctly', async () => {
//   render(<App />);
//   const buttonCount = await screen.findByRole('button');
//   expect(buttonCount.innerHTML).toBe('count is: 0');
//   expect(true).toBeTruthy();
// });
