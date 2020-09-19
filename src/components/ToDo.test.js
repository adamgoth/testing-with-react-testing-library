import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ToDo from './ToDo'

const setup = () => render(<ToDo />)

describe('<ToDo/>', () => {
  it('Renders without crashing', () => {
    const { getByRole } = setup()
    expect(getByRole('heading')).toBeInTheDocument()
  })

  describe('The default UI', () => {
    it('Renders two default todo items', () => {
      const { getAllByRole } = setup()
      expect(getAllByRole('listitem').length).toBe(2)
    })

    it('Has an input field', () => {
      const { getByRole } = setup()
      expect(getByRole('textbox')).toBeInTheDocument()
    })

    it('Has an add button', () => {
      const { getByLabelText } = setup()
      expect(getByLabelText('add')).toBeInTheDocument()
    })
  })

  describe('Adding items', () => {
    it('When the add button is pressed, if the input field is empty, prevent item from being added', () => {
      const { getByLabelText } = setup()
      window.alert = jest.fn()
      userEvent.click(getByLabelText('add'))
      expect(window.alert).toHaveBeenCalled()
    })

    it('When the add button is pressed, if the input field has text, it creates a new todo item', async () => {
      const { getByRole, getByLabelText, getByText } = setup()
      const toDoItem = 'fake item'
      userEvent.type(getByRole('textbox'), toDoItem)
      userEvent.click(getByLabelText('add'))
      const item = await getByText(toDoItem)
      expect(item).toBeInTheDocument()
    })
  })

  describe('Deleting items', () => {
    it('When the delete button is pressed for the first todo item, it removes the entire item', async () => {
      const { getAllByRole, getByLabelText, queryByText } = setup()
      // default item
      const toDoItem = 'clean the house'
      userEvent.click(getByLabelText(`delete ${toDoItem}`))
      const item = await queryByText(toDoItem)
      expect(item).toBeNull()
      // should only be 1 item left
      expect(getAllByRole('listitem').length).toBe(1)
    })
  })
})
