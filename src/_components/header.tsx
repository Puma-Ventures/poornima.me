import Navbar from '@/components/navigation/navbar'
import { getMenu } from '@/libs/api'

const Header = () => {
    const menu = getMenu()
    return <Navbar menu={menu} />
}

export default Header
