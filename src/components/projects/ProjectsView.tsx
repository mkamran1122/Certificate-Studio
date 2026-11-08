import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  Edit2,
  Calendar,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CertificateProject } from '../../types/certificate';
import { storage } from '../../utils/storage';
import { CertificateCanvas } from '../canvas/CertificateCanvas';
import { CERTIFICATE_TEMPLATES } from '../../data/templates';

interface ProjectsViewProps {
  onOpenProject: (project: CertificateProject) => void;
  onCreateNew: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onOpenProject,
  onCreateNew
}) => {
  const [projects, setProjects] = useState<CertificateProject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const refreshProjects = () => {
    setProjects(storage.getProjects());
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved project?')) {
      storage.deleteProject(id);
      refreshProjects();
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.duplicateProject(id);
    refreshProjects();
  };

  const handleExportJson = (project: CertificateProject, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.exportProjectAsJson(project);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = storage.parseProjectJson(content);
      if (parsed) {
        storage.saveProject(parsed);
        refreshProjects();
      } else {
        alert('Could not parse valid certificate project JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleStartRename = (project: CertificateProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditingName(project.name);
  };

  const handleSaveRename = (project: CertificateProject) => {
    if (editingName.trim()) {
      storage.saveProject({ ...project, name: editingName.trim() });
      refreshProjects();
    }
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Saved Certificate Projects
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Saved locally in your browser storage. Reopen designs anytime, duplicate variants, or export project JSON for backup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            onClick={onCreateNew}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Certificate</span>
          </button>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => {
            const isLandscape = proj.orientation === 'landscape';
            const scale = isLandscape ? 0.3 : 0.3;
            const containerHeight = isLandscape ? 'h-64' : 'h-88';
            const isEditing = editingId === proj.id;

            return (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj)}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-800 transition-all flex flex-col justify-between cursor-pointer"
              >
                {/* Visual Canvas Thumbnail Preview */}
                <div
                  className={`w-full ${containerHeight} bg-slate-100 dark:bg-slate-950/80 p-4 flex items-center justify-center overflow-hidden relative`}
                >
                  <div
                    className="relative shadow-md group-hover:scale-102 transition-transform duration-200"
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <CertificateCanvas
                      width={proj.width}
                      height={proj.height}
                      background={proj.background}
                      border={proj.border}
                      elements={proj.elements}
                      selectedElementId={null}
                      onSelectElement={() => {}}
                      onUpdateElement={() => {}}
                      readOnly={true}
                    />
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {isEditing ? (
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(proj);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="px-2 py-1 text-sm font-bold rounded border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-full"
                        />
                        <button
                          onClick={() => handleSaveRename(proj)}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded font-medium"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {proj.name}
                        </h3>
                        <button
                          onClick={(e) => handleStartRename(proj, e)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Rename design"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-mono">
                      <span>{proj.format}</span>
                      <span>·</span>
                      <span className="capitalize">{proj.orientation}</span>
                      <span>·</span>
                      <span>{proj.elements.length} elements</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicate(proj.id, e)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Duplicate design"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleExportJson(proj, e)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Export project JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-xl mx-auto space-y-4">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto opacity-60" />
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No saved projects yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Any certificate you design in Certificate Studio can be saved locally to this dashboard for quick retrieval.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onCreateNew}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start First Certificate
            </button>
            <button
              onClick={() => {
                const sample = CERTIFICATE_TEMPLATES[0];
                storage.saveProject({
                  ...sample,
                  id: 'proj_sample_' + Date.now(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                });
                refreshProjects();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              Save Sample Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
