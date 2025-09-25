import type { ImagerightClient, ImagerightDocument, ImagerightFolder } from '@bmb-inc/types';

export const clientData: ImagerightClient[] = [
  {
    id: 112967,
    fileTypeId: 1,
    fileTypeName: 'Policy',
    fileTypeDescription: 'Policy File',
    drawerId: 10,
    drawerName: 'Client Drawer',
    drawerDescription: 'Primary client documents',
    hasNotes: false,
    notesId: 0,
    description: 'Acme Corporation',
    fileNumberPart1: 'ACME',
    fileNumberPart2: '001',
    fileNumberPart3: 'A',
    isTemporary: false,
    isDeleted: false,
    dateLastOpened: '2025-09-25T09:00:00.000Z',
    lastModified: '2025-09-25T09:30:00.000Z',
    dateCreated: '2025-09-20T12:00:00.000Z',
    attributes: [
      {
        displayName: 'Client Code',
        name: 'clientCode',
        value: { description: 'ACME' },
        attributeType: { description: 'String', oneOf: 'atString' }
      },
      {
        displayName: 'Region',
        name: 'region',
        value: { description: 'Northeast' },
        attributeType: { description: 'String', oneOf: 'atString' }
      }
    ],
    effectivePermissions: 7,
    isFrozen: false,
    locationName: 'Boston'
  },
  {
    id: 113245,
    fileTypeId: 2,
    fileTypeName: 'Claims',
    fileTypeDescription: 'Claims File',
    drawerId: 11,
    drawerName: 'Claims Drawer',
    drawerDescription: 'Claims and related documents',
    hasNotes: null,
    notesId: 0,
    description: 'Globex LLC',
    fileNumberPart1: 'GLOB',
    fileNumberPart2: '042',
    fileNumberPart3: 'B',
    isTemporary: false,
    isDeleted: false,
    dateLastOpened: '2025-09-21T14:10:00.000Z',
    lastModified: '2025-09-23T16:45:00.000Z',
    dateCreated: '2025-09-15T08:30:00.000Z',
    attributes: [
      {
        displayName: 'Client Code',
        name: 'clientCode',
        value: { description: 'GLOB' },
        attributeType: { description: 'String', oneOf: 'atString' }
      }
    ],
    effectivePermissions: 7,
    isFrozen: false,
    locationName: 'New York'
  },
  {
    id: 114001,
    fileTypeId: 1,
    fileTypeName: 'Policy',
    fileTypeDescription: 'Policy File',
    drawerId: 12,
    drawerName: 'Client Drawer',
    drawerDescription: 'Primary client documents',
    hasNotes: true,
    notesId: 5012,
    description: 'Initech Inc.',
    fileNumberPart1: 'INIT',
    fileNumberPart2: '317',
    fileNumberPart3: 'C',
    isTemporary: false,
    isDeleted: false,
    dateLastOpened: '2025-09-24T11:20:00.000Z',
    lastModified: '2025-09-24T11:25:00.000Z',
    dateCreated: '2025-09-05T10:00:00.000Z',
    attributes: [
      {
        displayName: 'Client Code',
        name: 'clientCode',
        value: { description: 'INIT' },
        attributeType: { description: 'String', oneOf: 'atString' }
      },
      {
        displayName: 'Status',
        name: 'status',
        value: { description: 'Active' },
        attributeType: { description: 'String', oneOf: 'atString' }
      }
    ],
    effectivePermissions: 7,
    isFrozen: false,
    locationName: 'San Francisco'
  }
];

export default clientData;

export const foldersData: ImagerightFolder[] = [
  {
    id: 953607,
    description: 'Policies 2025',
    effectivePermissions: 7,
    fileId: 112967,
    parentFolderId: null,
    folderTypeId: 100,
    folderTypeDescription: 'Policy Folder',
    hasNotes: false,
    isDeleted: false,
    lastModified: '2025-09-24T10:00:00.000Z',
    dateCreated: '2025-09-20T10:00:00.000Z',
    attributes: [
      {
        displayName: 'Year',
        name: 'year',
        value: { description: '2025' },
        attributeType: { description: 'String', oneOf: 'atString' }
      }
    ],
    folderTypeName: 'Policies'
  },
  {
    id: 953608,
    description: 'Endorsements',
    effectivePermissions: 7,
    fileId: 112967,
    parentFolderId: null,
    folderTypeId: 101,
    folderTypeDescription: 'Endorsements Folder',
    hasNotes: null,
    isDeleted: false,
    lastModified: '2025-09-22T15:30:00.000Z',
    dateCreated: '2025-09-18T09:15:00.000Z',
    attributes: [],
    folderTypeName: 'Endorsements'
  },
  {
    id: 953609,
    description: 'Claims',
    effectivePermissions: 7,
    fileId: 113245,
    parentFolderId: null,
    folderTypeId: 200,
    folderTypeDescription: 'Claims Folder',
    hasNotes: true,
    isDeleted: false,
    lastModified: '2025-09-21T12:05:00.000Z',
    dateCreated: '2025-09-10T08:45:00.000Z',
    attributes: [
      {
        displayName: 'Severity',
        name: 'severity',
        value: { description: 'High' },
        attributeType: { description: 'String', oneOf: 'atString' }
      }
    ],
    folderTypeName: 'Claims'
  }
]

export const documentsData: ImagerightDocument[] = [
  {
    id: 700001,
    description: 'Policy Declarations',
    effectivePermissions: 7,
    pageCount: 12,
    dateCreated: '2025-09-20T12:30:00.000Z',
    dateLastModified: '2025-09-21T09:10:00.000Z',
    documentDate: '2025-09-19T00:00:00.000Z',
    receivedDate: '2025-09-20T12:00:00.000Z',
    deleted: false,
    documentTypeId: 300,
    documentTypeDescription: 'Declarations',
    attributes: [
      {
        displayName: 'Policy Number',
        name: 'policyNumber',
        value: { description: 'ACME-001-A' },
        attributeType: { description: 'String', oneOf: 'atString' }
      }
    ],
    cutOffDate: '2026-09-19T00:00:00.000Z',
    retentionDate: '2030-09-19T00:00:00.000Z',
    documentName: 'ACME Declarations.pdf',
    file: clientData[0],
    folder: [foldersData[0]]
  },
  {
    id: 700002,
    description: 'Endorsement Notice',
    effectivePermissions: 7,
    pageCount: 2,
    dateCreated: '2025-09-18T08:30:00.000Z',
    dateLastModified: '2025-09-18T09:00:00.000Z',
    documentDate: '2025-09-17T00:00:00.000Z',
    receivedDate: '2025-09-18T08:15:00.000Z',
    deleted: false,
    documentTypeId: 301,
    documentTypeDescription: 'Endorsement',
    attributes: [],
    cutOffDate: '2026-09-17T00:00:00.000Z',
    retentionDate: '2030-09-17T00:00:00.000Z',
    documentName: 'Endorsement-Notice.pdf',
    file: clientData[0],
    folder: [foldersData[1]]
  },
  {
    id: 700003,
    description: 'Loss Summary',
    effectivePermissions: 7,
    pageCount: 5,
    dateCreated: '2025-09-12T14:45:00.000Z',
    dateLastModified: '2025-09-13T10:00:00.000Z',
    documentDate: '2025-09-10T00:00:00.000Z',
    receivedDate: '2025-09-12T14:30:00.000Z',
    deleted: false,
    documentTypeId: 400,
    documentTypeDescription: 'Claims Report',
    attributes: [
      {
        displayName: 'Claim Id',
        name: 'claimId',
        value: { description: 'CLM-2025-009' },
        attributeType: { description: 'String', oneOf: 'atString' }
      }
    ],
    cutOffDate: '2026-09-10T00:00:00.000Z',
    retentionDate: '2031-09-10T00:00:00.000Z',
    documentName: 'Loss-Summary.pdf',
    file: clientData[1],
    folder: [foldersData[2]]
  }
]