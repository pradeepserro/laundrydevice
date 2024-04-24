/** Icons are imported separatly to reduce build time */
import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const settingsRoutes = [
    {
        path: '/app/settings',
        icon: <AdjustmentsHorizontalIcon className={iconClasses}/>,
        name: 'Settings',
    }
]


export default settingsRoutes


