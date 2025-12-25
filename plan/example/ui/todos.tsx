import { eq, useLiveQuery } from '@tanstack/react-db'
import { todoCollection } from '../collections/todo'
import type { Todo } from '../types'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type TodosProps = {
  projectId: string
}

export const Todos = ({ projectId }: TodosProps) => {
  const updateTodo = (todo: Todo) => (completed: boolean) => {
    try {
      todoCollection.update(todo.id, (draft) => {
        draft.completed = completed
      })
    } catch (error) {
      console.error(error)
    }
  }

  const { data: todos } = useLiveQuery((q) =>
    q
      .from({ todo: todoCollection })
      .where(({ todo }) => eq(todo.projectId, projectId)),
  )

  return todos.map((todo) => (
    <Item variant="outline" key={todo.id} className={cn('m-2')}>
      <ItemContent>
        <ItemTitle>{todo.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Checkbox onCheckedChange={updateTodo(todo)} checked={todo.completed} />
      </ItemActions>
    </Item>
  ))
}
