import { Stack, Text, Paper, Group, Badge, Divider, ScrollArea } from '@mantine/core';
import { IconUser, IconUsers, IconCalendar, IconPaperclip } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { parseEml } from 'eml-parse-js';
import * as MsgReaderModule from 'msgreader';

// Handle both ESM default import and CommonJS module.exports
const MsgReader = MsgReaderModule.default || MsgReaderModule;

type EmailData = {
  subject: string;
  from: string;
  to: string;
  date: string;
  htmlBody: string | null;
  textBody: string | null;
  attachments: string[];
};

type EmailPreviewProps = {
  data: ArrayBuffer;
  extension: string;
};

// Recursively find body content from parsed EML structure
function findBodyContent(body: any[], result: { html: string | null; text: string | null; attachments: string[] }) {
  if (!Array.isArray(body)) return;
  
  for (const item of body) {
    if (item.part) {
      const contentType = item.part.headers?.['Content-Type'] || '';
      const contentDisposition = item.part.headers?.['Content-Disposition'] || '';
      
      // Check if it's an attachment
      if (contentDisposition.includes('attachment')) {
        const filenameMatch = contentDisposition.match(/filename="?([^";\r\n]+)"?/i);
        if (filenameMatch) {
          result.attachments.push(filenameMatch[1]);
        }
        continue;
      }
      
      // Check for HTML content
      if (contentType.includes('text/html') && item.part.body) {
        if (typeof item.part.body === 'string') {
          result.html = item.part.body;
        }
      }
      
      // Check for plain text content
      if (contentType.includes('text/plain') && item.part.body) {
        if (typeof item.part.body === 'string') {
          result.text = item.part.body;
        }
      }
      
      // Recurse into nested body parts
      if (Array.isArray(item.part.body)) {
        findBodyContent(item.part.body, result);
      }
    }
  }
}

function parseEmlData(parsed: any): EmailData {
  const headers = parsed.headers || {};
  
  // Extract body content
  const bodyResult = { html: null as string | null, text: null as string | null, attachments: [] as string[] };
  if (Array.isArray(parsed.body)) {
    findBodyContent(parsed.body, bodyResult);
  }
  
  return {
    subject: headers.Subject || '(No Subject)',
    from: headers.From || '',
    to: headers.To || '',
    date: headers.Date || '',
    htmlBody: bodyResult.html,
    textBody: bodyResult.text,
    attachments: bodyResult.attachments
  };
}

function parseMsgData(msgData: any): EmailData {
  // Extract sender info
  const senderName = msgData.senderName || '';
  const senderEmail = msgData.senderEmail || '';
  const from = senderEmail 
    ? (senderName ? `${senderName} <${senderEmail}>` : senderEmail)
    : senderName;

  // Extract recipients
  const recipients = msgData.recipients || [];
  const toList = recipients
    .map((r: any) => {
      const name = r.name || '';
      const email = r.email || '';
      return email ? (name ? `${name} <${email}>` : email) : name;
    })
    .filter(Boolean)
    .join(', ');

  // Extract attachments
  const attachments = (msgData.attachments || [])
    .map((att: any) => att.fileName || att.name || 'Attachment')
    .filter(Boolean);

  // Format date if available
  let dateStr = '';
  if (msgData.messageDeliveryTime) {
    try {
      dateStr = new Date(msgData.messageDeliveryTime).toLocaleString();
    } catch {
      dateStr = msgData.messageDeliveryTime;
    }
  } else if (msgData.creationTime) {
    try {
      dateStr = new Date(msgData.creationTime).toLocaleString();
    } catch {
      dateStr = msgData.creationTime;
    }
  }

  return {
    subject: msgData.subject || '(No Subject)',
    from,
    to: toList,
    date: dateStr,
    htmlBody: msgData.bodyHTML || null,
    textBody: msgData.body || null,
    attachments,
  };
}

export function EmailPreview({ data, extension }: EmailPreviewProps) {
  const [email, setEmail] = useState<EmailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parseEmail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const ext = extension.toLowerCase();
        
        if (ext === 'eml') {
          const decoder = new TextDecoder('utf-8');
          const emlContent = decoder.decode(data);
          
          parseEml(emlContent, (err, result) => {
            if (err) {
              setError(err.message || 'Failed to parse EML');
            } else if (result) {
              const emailData = parseEmlData(result);
              setEmail(emailData);
            }
            setLoading(false);
          });
          return;
        } else if (ext === 'msg') {
          // Parse MSG file using msgreader
          const msgReader = new MsgReader(data);
          const msgData = msgReader.getFileData();
          
          if (!msgData) {
            setError('Failed to parse MSG file');
            setLoading(false);
            return;
          }
          
          const emailData = parseMsgData(msgData);
          setEmail(emailData);
          setLoading(false);
          return;
        } else {
          throw new Error(`Unsupported email format: ${extension}`);
        }
      } catch (err) {
        console.error('Failed to parse email:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse email');
        setLoading(false);
      }
    };

    parseEmail();
  }, [data, extension]);

  if (loading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed" size="sm">Parsing email...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="red" size="sm">Error: {error}</Text>
      </Stack>
    );
  }

  if (!email) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed" size="sm">No email data</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="sm" h="100%" style={{ overflow: 'hidden' }}>
      {/* Email header */}
      <Paper p="sm" withBorder style={{ flexShrink: 0 }}>
        <Stack gap="xs">
          <Text fw={600} size="md" lineClamp={2}>{email.subject}</Text>
          
          <Group gap="xs" wrap="nowrap">
            <IconUser size={14} style={{ flexShrink: 0 }} />
            <Text size="sm" c="dimmed" truncate>From: {email.from}</Text>
          </Group>
          
          <Group gap="xs" wrap="nowrap">
            <IconUsers size={14} style={{ flexShrink: 0 }} />
            <Text size="sm" c="dimmed" truncate>To: {email.to}</Text>
          </Group>
          
          {email.date && (
            <Group gap="xs" wrap="nowrap">
              <IconCalendar size={14} style={{ flexShrink: 0 }} />
              <Text size="sm" c="dimmed">{email.date}</Text>
            </Group>
          )}
          
          {email.attachments.length > 0 && (
            <Group gap="xs" wrap="wrap">
              <IconPaperclip size={14} style={{ flexShrink: 0 }} />
              {email.attachments.map((name, idx) => (
                <Badge key={idx} size="sm" variant="light" leftSection={<IconPaperclip size={10} />}>
                  {name}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>
      </Paper>

      <Divider />

      {/* Email body */}
      <ScrollArea style={{ flex: 1 }} offsetScrollbars>
        {email.htmlBody ? (
          <div
            style={{ 
              padding: 'var(--mantine-spacing-sm)',
              background: 'white',
              minHeight: '100%'
            }}
            dangerouslySetInnerHTML={{ __html: email.htmlBody }}
          />
        ) : email.textBody ? (
          <Text
            size="sm"
            style={{ 
              whiteSpace: 'pre-wrap',
              padding: 'var(--mantine-spacing-sm)'
            }}
          >
            {email.textBody}
          </Text>
        ) : (
          <Text c="dimmed" size="sm" ta="center" p="md">
            No email body content
          </Text>
        )}
      </ScrollArea>
    </Stack>
  );
}

export default EmailPreview;

