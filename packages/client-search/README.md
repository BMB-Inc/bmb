# @bmb-inc/client-search

A reusable client search component for React applications using Mantine UI.

## Installation

```bash
npm install @bmb-inc/client-search
# or
yarn add @bmb-inc/client-search
```

## Components

### ClientSearch

A standalone searchable select component for finding clients.

```tsx
import { ClientSearch } from '@bmb-inc/client-search';

function MyComponent() {
  return (
    <div>
      <h2>Find a Client</h2>
      <ClientSearch />
    </div>
  );
}
```

### ClientSearchForm

A form-connected version of the client search component that works with Mantine forms.

```tsx
import { useForm } from '@mantine/form';
import { ClientSearchForm } from '@bmb-inc/client-search';
import { Button } from '@mantine/core';

function MyFormComponent() {
  const form = useForm({
    initialValues: {
      clientId: '',
      // other fields...
    },
    validate: {
      clientId: (value) => (!value ? 'Please select a client' : null),
    },
  });

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <ClientSearchForm
        form={form}
        name="clientId"
        label="Client"
        placeholder="Search clients..."
      />
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## API Reference

### ClientSearch Props

| Prop | Type | Description |
|------|------|-------------|
| placeholder | string | Placeholder text |
| label | string | Input label |
| disabled | boolean | Whether the input is disabled |

### ClientSearchForm Props

| Prop | Type | Description |
|------|------|-------------|
| form | MantineForm | Mantine form instance |
| name | string | Form field name to bind to |
| placeholder | string | Placeholder text |
| label | string | Input label |
| disabled | boolean | Whether the input is disabled |

## Requirements

This package requires the following peer dependencies:

- React 18+
- @mantine/core ^8.0.0
- @mantine/form ^8.0.0
- @mantine/hooks ^8.0.0
- @tanstack/react-query ^5.0.0

## License

MIT