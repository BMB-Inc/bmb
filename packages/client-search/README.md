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

A form-connected version of the client search component that works with Mantine forms. It supports generic form values for type safety.

```tsx
import { useForm } from '@mantine/form';
import { ClientSearchForm } from '@bmb-inc/client-search';
import { Button } from '@mantine/core';

// Define your form values type
interface MyFormValues {
  clientId: string | null;
  // other fields...
  name: string;
}

function MyFormComponent() {
  // Use the generic type parameter with useForm
  const form = useForm<MyFormValues>({
    initialValues: {
      clientId: null,
      name: '',
      // other fields...
    },
    validate: {
      clientId: (value) => (!value ? 'Please select a client' : null),
    },
  });

  const handleSubmit = (values: MyFormValues) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {/* Pass the same form type to the component */}
      <ClientSearchForm<MyFormValues>
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
| form | UseFormReturnType<T> | Mantine form instance with generic type T |
| name | keyof T & string | Form field name to bind to (must be a key of your form values type) |
| placeholder | string | Placeholder text |
| label | string | Input label |
| disabled | boolean | Whether the input is disabled |

### Type Safety

To avoid using `as any` when working with the ClientSearchForm component, always specify the generic type parameter that matches your form's type:

```tsx
// Define your form type
interface MyFormValues {
  client_id: string | null;
  // other fields...
}

// Create your form with the same type
const form = useForm<MyFormValues>({
  initialValues: {
    client_id: null,
    // ...
  }
});

// Use the component with the same type
<ClientSearchForm<MyFormValues> 
  form={form} 
  name="client_id" 
/>
```

By using the same type for both your form and the ClientSearchForm component, TypeScript will ensure that the `name` prop is actually a key in your form values.

### Type Safety

For type safety, you can use the generic parameter to specify your form values type:

```tsx
<ClientSearchForm<MyFormValues>>
```

Where `MyFormValues` is the interface or type that defines your form structure. This ensures proper typing when using the component with Mantine forms.

## Requirements

This package requires the following peer dependencies:

- React 18+
- @mantine/core ^8.0.0
- @mantine/form ^8.0.0
- @mantine/hooks ^8.0.0
- @tanstack/react-query ^5.0.0

## License

MIT