// import { Project } from '@/types';
// import { compressProject } from '@/utils/compression/compression';

// type DownloadButtonProps = {
//   project: Project;
// };

// export function DownloadButton({ project }: DownloadButtonProps) {
//   const handleDownload = () => {
//     const compressedProject = compressProject(project);
//     const projectData = JSON.stringify(compressedProject, null, 2);
//     const blob = new Blob([projectData], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.json`;
//     document.body.appendChild(a);
//     a.click();

//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <button
//       aria-label="Download project as JSON"
//       className="flex w-10 items-center gap-1 rounded px-3 py-1 text-center text-sm text-gray-500 transition-colors hover:bg-gray-200"
//       title="Download project as JSON"
//       onClick={handleDownload}
//     >
//       ↓
//     </button>
//   );
// }
