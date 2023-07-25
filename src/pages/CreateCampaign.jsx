import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";

import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from "../utils";
import { useStateContext } from '../context';

const initialState = {
  name: "",
  title: "",
  description: "",
  target: "",
  deadline: "",
  image: ""
}

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(initialState);
  const { createCampaign } = useStateContext();

  const handleFormFieldChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    checkIfImage(form.image, async (exists) => {
      if(exists) {
        const data = { ...form, target: ethers.utils.parseUnits(form.target, 18) }
        console.log("data is ", data);
        setIsLoading(true);
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) })
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: '' })
      }
    })
    setForm(initialState)
  }

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start a Campaign</h1>
      </div>
      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
          <div className='flex flex-wrap gap-[40px]'>
              <FormField 
                label="Your Name *"
                placeHolder="John Doe"
                inputType="text"
                name="name"
                value={form.name}
                handleChange={handleFormFieldChange}
              />

              <FormField 
                label="Campaign title *"
                placeHolder="Write a title"
                inputType="text"
                name="title"
                value={form.title}
                handleChange={handleFormFieldChange}
              />
          </div>

              <FormField 
                label="Story *"
                placeHolder="Tell Your Story"
                isTextArea
                name="description"
                value={form.description}
                handleChange={handleFormFieldChange}
              />

              <div className='w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]'>
                <img src={money} alt='money' className='w-[40px] h-[40px] object-contain' />
                <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>You will get 100% of the raised amount</h4>
              </div>

              <div className='flex flex-wrap gap-[40px]'>
                <FormField 
                  label="Goal *"
                  placeHolder="ETH 0.50"
                  inputType="text"
                  name="target"
                  value={form.target}
                  handleChange={handleFormFieldChange}
                />

                <FormField 
                  label="End Date *"
                  placeHolder="End Date"
                  inputType="date"
                  name="deadline"
                  value={form.deadline}
                  handleChange={handleFormFieldChange}
                />

              </div>

              <FormField 
                label="Campaign image *"
                placeHolder="place image url"
                inputType="url"
                name="image"
                value={form.image}
                handleChange={handleFormFieldChange}
              />

              <div className='flex justify-center items-center mt-[40px]'>
                  <CustomButton 
                    btnType="submit"
                    title="Submit new campaign"
                    styles="bg-[#1dc071]"
                    handleClick={handleSubmit}
                  />
              </div>
      </form>
    </div>
  )
}

export default CreateCampaign