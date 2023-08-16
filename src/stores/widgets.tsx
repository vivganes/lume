import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { LumeStorage } from '@libs/storage/instance';

import { Widget } from '@utils/types';

interface WidgetState {
  widgets: null | Array<Widget>;
  fetchWidgets: (db: LumeStorage) => void;
  setWidget: (db: LumeStorage, { kind, title, content }: Widget) => void;
  removeWidget: (db: LumeStorage, id: string) => void;
}

export const useWidgets = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: null,
      fetchWidgets: async (db: LumeStorage) => {
        const widgets = await db.getWidgets();

        // default: add network widget
        widgets.unshift({
          id: String(widgets.length + 1),
          title: 'Network',
          content: '',
          kind: 9999,
        });

        set({ widgets: widgets });
      },
      setWidget: async (db: LumeStorage, { kind, title, content }: Widget) => {
        const widget: Widget = await db.createWidget(kind, title, content);
        set((state) => ({ widgets: [...state.widgets, widget] }));
      },
      removeWidget: async (db: LumeStorage, id: string) => {
        await db.removeWidget(id);
        set((state) => ({ widgets: state.widgets.filter((widget) => widget.id !== id) }));
      },
    }),
    {
      name: 'widgets',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
