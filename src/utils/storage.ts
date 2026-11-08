import { CertificateProject } from '../types/certificate';

const PROJECTS_STORAGE_KEY = 'certificate_studio_projects';
const AUTOSAVE_DRAFT_KEY = 'certificate_studio_active_draft';

export const storage = {
  getProjects(): CertificateProject[] {
    try {
      const data = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as CertificateProject[];
    } catch (e) {
      console.error('Failed to read projects from storage', e);
      return [];
    }
  },

  getProjectById(id: string): CertificateProject | null {
    const list = this.getProjects();
    return list.find(p => p.id === id) || null;
  },

  saveProject(project: CertificateProject): boolean {
    try {
      const list = this.getProjects();
      const existingIndex = list.findIndex(p => p.id === project.id);
      const updatedProject = {
        ...project,
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        list[existingIndex] = updatedProject;
      } else {
        list.unshift(updatedProject);
      }

      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to save project', e);
      return false;
    }
  },

  deleteProject(id: string): boolean {
    try {
      const list = this.getProjects().filter(p => p.id !== id);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to delete project', e);
      return false;
    }
  },

  duplicateProject(id: string): CertificateProject | null {
    const original = this.getProjectById(id);
    if (!original) return null;

    const copy: CertificateProject = {
      ...original,
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: original.elements.map(el => ({ ...el, id: 'el_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7) }))
    };

    if (this.saveProject(copy)) {
      return copy;
    }
    return null;
  },

  saveActiveDraft(project: CertificateProject): void {
    try {
      localStorage.setItem(AUTOSAVE_DRAFT_KEY, JSON.stringify(project));
    } catch (e) {
      console.warn('Failed to autosave active draft', e);
    }
  },

  getActiveDraft(): CertificateProject | null {
    try {
      const data = localStorage.getItem(AUTOSAVE_DRAFT_KEY);
      if (!data) return null;
      return JSON.parse(data) as CertificateProject;
    } catch (e) {
      return null;
    }
  },

  clearActiveDraft(): void {
    localStorage.removeItem(AUTOSAVE_DRAFT_KEY);
  },

  exportProjectAsJson(project: CertificateProject): void {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_design.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  parseProjectJson(fileContent: string): CertificateProject | null {
    try {
      const parsed = JSON.parse(fileContent);
      if (parsed && parsed.elements && Array.isArray(parsed.elements)) {
        return {
          ...parsed,
          id: 'proj_' + Date.now(),
          updatedAt: new Date().toISOString()
        };
      }
      return null;
    } catch (e) {
      console.error('Invalid JSON file', e);
      return null;
    }
  }
};
