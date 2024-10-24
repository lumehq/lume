import type { LumeColumn } from '@/types'
import { createFileRoute } from '@tanstack/react-router'
import { resolveResource } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/plugin-fs'

export const Route = createFileRoute('/_app/')({
  loader: async ({ context }) => {
    const prevColumns = window.localStorage.getItem('columns')

    if (!prevColumns) {
      const resourcePath = await resolveResource('resources/columns.json')
      const resourceFile = await readTextFile(resourcePath)
      const content: LumeColumn[] = JSON.parse(resourceFile)
      const initialAppColumns = content.filter((col) => col.default)

      return initialAppColumns
    } else {
      const parsed: LumeColumn[] = JSON.parse(prevColumns)
      const initialAppColumns = parsed.filter((item) =>
        item.account ? context.accounts.includes(item.account) : item,
      )

      return initialAppColumns
    }
  },
})
