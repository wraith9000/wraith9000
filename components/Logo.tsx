import React from 'react'
import BotsLogo from './wraith9000/Logo';
import Link from 'next/link'

const Logo: React.FC = () => (
  <Link href='/'>
    <BotsLogo />
  </Link>
)

export default Logo
