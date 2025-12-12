import { ImageRightBrowser } from "@components/ImageRightBrowser";
import { Button, Group, Modal, Stack, Title } from "@mantine/core";
import { DocumentTypes, FolderTypes } from "@bmb-inc/types";
import { useDisclosure } from "@mantine/hooks";
import { useSelectedPages } from "@hooks/useSelectedPages";

const FOLDER_TYPES = [
  FolderTypes.policyTerm,
  FolderTypes.policy,
  FolderTypes.binding,
  FolderTypes.blueFolder,
  FolderTypes.carrier,
  FolderTypes.submissions,
  FolderTypes.policyCheckingDocuments,
  FolderTypes.proposalShell,
  FolderTypes.applications,
  FolderTypes.proposals,
  FolderTypes.quotes,
  FolderTypes.accounting,
  FolderTypes.auditsAuditCorrespondence,
  FolderTypes.auditsExpMods,
  FolderTypes.binding,
  FolderTypes.blueFolder,
  FolderTypes.carrier,
  FolderTypes.submissions,
  FolderTypes.policyCheckingDocuments,
  FolderTypes.proposalShell,
  FolderTypes.applications,
  FolderTypes.proposals,
  FolderTypes.quotes,
];

const DOCUMENT_TYPES = [
  DocumentTypes.policy,
  DocumentTypes.proposal,
  DocumentTypes.quote,
  DocumentTypes.apps,
  DocumentTypes.applications,
  DocumentTypes.confirm,
  DocumentTypes.proposal,
  DocumentTypes.renWs,
  DocumentTypes.proposalFinal,
  DocumentTypes.bindingInfo,
  DocumentTypes.cab,
  DocumentTypes.policy,
  DocumentTypes.canc,
  DocumentTypes.nonRenewal,
  DocumentTypes.endt,
  DocumentTypes.expMod,
  DocumentTypes.reportingForm,
  DocumentTypes.noticeOfLoss,
  DocumentTypes.corr,
  DocumentTypes.carrierNoticesPayment,
  DocumentTypes.estimates,
  DocumentTypes.legalDocs,
  DocumentTypes.claimsReview,
  DocumentTypes.newMail,
];

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  const { selectedPages } = useSelectedPages();

  console.log(selectedPages);

  return (
    <Stack m="lg">
      <Title order={1} ta="center" mb="xl">
        ImageRight
      </Title>
      <Button onClick={open}>Open Modal</Button>
      <Modal opened={opened} onClose={close} title="ImageRight" size="70%">
        <Stack>
          <ImageRightBrowser
          documentTypes={DOCUMENT_TYPES}
            folderTypes={FOLDER_TYPES}
            defaultViewMode="tree" />

          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button variant="filled">Use selected</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default App
