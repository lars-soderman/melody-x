import { Project } from '@/types';

type DownloadButtonProps = {
  project: Project;
};

export function DownloadButton({ project }: DownloadButtonProps) {
  const handleDownload = () => {
    // Strip unnecessary boxes
    const strippedBoxes = project.boxes.filter(
      (box) => box.letter || box.black || box.hint || box.arrow || box.stop
    );

    const cleanProject = {
      ...project,
      boxes: strippedBoxes,
    };

    // Create download
    const projectData = JSON.stringify(cleanProject, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Download file
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      aria-label="Download project as JSON"
      //   className="rounded px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100"
      className="flex w-10 items-center gap-1 rounded px-3 py-1 text-center text-sm text-gray-500 transition-colors hover:bg-gray-200"
      title="Download project as JSON"
      onClick={handleDownload}
    >
      ↓
    </button>
  );
}
