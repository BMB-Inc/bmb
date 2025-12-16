import { ImageRightBrowser } from "@components/ImageRightBrowser";
import { Group, Stack, Title } from "@mantine/core";
import { DocumentTypes, FileTypes, FolderTypes } from "@bmb-inc/types"; 
import { TaskWorkflowViewer } from "@components/task-workflow";

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

const FILE_TYPES = [FileTypes.PDF, FileTypes.JPG, FileTypes.PNG, FileTypes.DOC, FileTypes.DOCX, FileTypes.XLS, FileTypes.XLSX, FileTypes.MSG, FileTypes.EML];

function App() {
  return (
    <Stack m="lg">
      <Title order={1} ta="center" mb="xl">
        ImageRight
      </Title>
      <Group justify="center">
        <TaskWorkflowViewer
        />
      <ImageRightBrowser
        documentTypes={DOCUMENT_TYPES}
        folderTypes={FOLDER_TYPES}
        defaultViewMode="tree"
        allowedExtensions={FILE_TYPES}
      />
      </Group>
    </Stack>
  );
}

export default App
