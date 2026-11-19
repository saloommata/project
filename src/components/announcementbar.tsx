// src/components/announcementbar.tsx
//
// Renders the admin-editable "Announcement Bar Text" (Settings → Site Copy)
// as a thin strip above the header. Renders nothing when the field is blank
// (the default), so stores that don't use it see no visual change at all.
import { useApp } from '../context/appcontext';
import { useStoreConfig } from '../context/storeconfig';
import { getText } from '../utils/helpers';

export default function AnnouncementBar() {
  const { state } = useApp();
  const storeConfig = useStoreConfig();
  const text = getText(storeConfig.content.announcementText, state.language);

  if (!text) return null;

  return (
    <div className="bg-secondary text-[#EFE9DD] text-xs sm:text-sm font-mono-label text-center py-2 px-4">
      {text}
    </div>
  );
}
