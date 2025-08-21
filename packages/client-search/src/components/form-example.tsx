import { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Card, Group, Stack, TextInput } from "@mantine/core";
import { ClientSearchForm } from "./client-search-form";

// Define the form values type explicitly for better type safety
interface ClientFormValues {
  clientId: string | null;
  clientName: string;
  notes: string;
}

export const FormExample = () => {
  const [submittedValues, setSubmittedValues] = useState<ClientFormValues | null>(null);

  // Set up the form with proper typing
  const form = useForm<ClientFormValues>({
    initialValues: {
      clientId: null,
      clientName: "",
      notes: "",
    },
    validate: {
      clientId: (value) => {
        // Validation handled by the form system, not HTML required attribute
        if (!value || value.trim() === "") {
          return "Please select a client";
        }
        return null;
      },
    },
  });

  // Handle form submission
  const handleSubmit = (values: ClientFormValues) => {
    console.log("Form submitted with:", values);
    setSubmittedValues(values);
  };

  return (
    <Card withBorder p="md" radius="md">
      <h2>Client Form Example</h2>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Client Search component with proper type safety */}
          <ClientSearchForm<ClientFormValues>
            form={form}
            name="clientId"
            label="Select Client"
            placeholder="Search for a client..."
          />

          {/* Regular form fields */}
          <TextInput
            label="Client Name Override"
            placeholder="Optional custom name"
            {...form.getInputProps("clientName")}
          />

          <TextInput
            label="Notes"
            placeholder="Enter any additional notes"
            {...form.getInputProps("notes")}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit" color="blue" fullWidth>
              Submit
            </Button>
          </Group>
        </Stack>
      </form>

      {/* Display submitted values for demonstration */}
      {submittedValues && (
        <Card mt="lg" withBorder p="sm" radius="md">
          <h3>Submitted Values</h3>
          <pre>{JSON.stringify(submittedValues, null, 2)}</pre>
        </Card>
      )}
    </Card>
  );
};
