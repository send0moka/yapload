import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload custom logo to replace the default Payload logo. Leave empty to use default Payload logo. Logo will automatically invert colors based on theme (dark logo for light theme, light logo for dark theme).',
      },
    },
    {
      name: 'showSearchButton',
      type: 'checkbox',
      label: 'Show Search Button',
      defaultValue: true,
      admin: {
        description: 'Toggle to show/hide the search button in the header navigation.',
      },
    },
    {
      name: 'showThemeToggle',
      type: 'checkbox',
      label: 'Show Theme Toggle',
      defaultValue: true,
      admin: {
        description: 'Toggle to show/hide the theme switch button in the header navigation.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
