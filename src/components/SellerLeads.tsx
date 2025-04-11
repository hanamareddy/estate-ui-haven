import SellerInquiriesView from '@/components/SellerInquiriesView';
import Navbar from './Navbar';
import MobileNavBar from './MobileNavBar';
import React from 'react'

function SellerLeads() {
  return (
    <>
    <Navbar/>
    <SellerInquiriesView/>
    <MobileNavBar/>
    </>
  )
}

export default SellerLeads