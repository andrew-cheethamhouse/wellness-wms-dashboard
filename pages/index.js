import Head from 'next/head'
import Image from 'next/image'
import Dashboard from '../components/Dashboard'
import OrderDisplay from '../components/OrderDisplay'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Mesoestetic WMS Packing Dashboard</title>
        <meta name="description" content="Mesoestetic WMS Dashboard" />
        <link rel="icon" href="/mesoestetic-fav.png" />
      </Head>
      <main>
        <Dashboard></Dashboard>
      </main>
      </div>
  )
}
