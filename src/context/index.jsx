import React, { useContext, createContext } from "react";
import { useAddress, useContract, useMetamask, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x762dC93b15e8d2eC5995E4428Ba3Ccc1a1B3aD6f');

    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        console.log("data from context...", form);
        
        try {
            const data = await createCampaign({
                args: [
                    address, //owner
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image
                ]
            })
        console.log("Contract call success..", data);
        } catch (error) {
            console.log("Contract call Failed..", error);
        }
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');
        const parsedCampaigns = campaigns.map((campaign, index) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: index
        }));

        return parsedCampaigns;
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns
            }}
        >
            {children}
        </StateContext.Provider>
    )

}

export const useStateContext = () => useContext(StateContext);