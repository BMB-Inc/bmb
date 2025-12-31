/**
 * Extract year from folder name if it exists
 * Looks for 4-digit years (e.g., 2026, 2025, 2024)
 */
function extractYear(folderName: string): number | null {
  const yearMatch = folderName.match(/\b(20\d{2})\b/);
  return yearMatch ? parseInt(yearMatch[1], 10) : null;
}

/**
 * Check if folder is "New Mail"
 */
function isNewMailFolder(folderName: string): boolean {
  return folderName.toLowerCase().includes('new mail');
}

/**
 * Custom folder sorting:
 * 1. "New Mail" folder first
 * 2. Policy term folders with years (newest year first)
 * 3. Other folders by last modified date (newest first)
 */
export function sortFolders(folders: any[]): any[] {
  return [...folders].sort((a: any, b: any) => {
    const aName = a.description ?? a.folderTypeName ?? '';
    const bName = b.description ?? b.folderTypeName ?? '';
    
    const aIsNewMail = isNewMailFolder(aName);
    const bIsNewMail = isNewMailFolder(bName);
    
    // New Mail always comes first
    if (aIsNewMail && !bIsNewMail) return -1;
    if (!aIsNewMail && bIsNewMail) return 1;
    
    // If both are New Mail (unlikely), sort by date
    if (aIsNewMail && bIsNewMail) {
      const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return bDate - aDate;
    }
    
    // Check for year-based folders (policy terms)
    const aYear = extractYear(aName);
    const bYear = extractYear(bName);
    
    // Both have years - sort by year descending (newest first)
    if (aYear !== null && bYear !== null) {
      return bYear - aYear;
    }
    
    // Only a has year - it comes first
    if (aYear !== null && bYear === null) return -1;
    
    // Only b has year - it comes first
    if (aYear === null && bYear !== null) return 1;
    
    // Neither has year - sort by last modified date (newest first)
    const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
    const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
    return bDate - aDate;
  });
}

