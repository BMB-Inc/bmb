import { Card, Group, Stack, Text } from "@mantine/core";
import { foldersData, clientData, documentsData } from "../../data/data";
import { useState } from "react";
import { IconBuilding } from '@tabler/icons-react';
import classes from '@modules/hover-card.module.css'
export function FileTree() {
  const [folders, setFolders] = useState([])
  const clientFolders = clientData?.map(client => {
    return (
      <Card key={client.id} className={classes.hoverCard}>
        <Group gap='xs'>
          <IconBuilding />
        <Text>
        {client.description} - {client.fileNumberPart1}
        </Text>
        </Group>
      </Card>
    )
  })

  return <Stack>
    {clientFolders}
  </Stack>;
  
}