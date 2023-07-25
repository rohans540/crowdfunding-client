import React, { useState, useEffect } from 'react';

import { DisplayCampaigns } from "../components";
import { useStateContext } from '../context';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext()

  const fetchCampaigns = async () => {
    setLoading(true)
    const data = await getUserCampaigns();
    setCampaigns(data);
    setLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract])

  return (
    <DisplayCampaigns 
      title="My Campaigns"
      isLoading={loading}
      campaigns={campaigns}
    />
  )
}

export default Profile