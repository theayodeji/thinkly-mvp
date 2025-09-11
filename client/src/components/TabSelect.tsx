import clsx from 'clsx'
import React from 'react'

type Tab = 'sources' | 'chat'

type Props = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TabSelect = ({ activeTab, onTabChange }: Props) => {
  return (
    <div className='box-border w-full lg:hidden flex relative border-b border-neutral-200'>
      <div 
        onClick={() => onTabChange('sources')}
        className={clsx(
          'flex-1 flex items-center justify-center py-4 cursor-pointer transition-colors duration-300',
          activeTab === 'sources' ? 'text-primary-500' : 'text-gray-500 hover:bg-neutral-50'
        )}
      >
        <h3 className='font-medium'>Sources</h3>
      </div>
      <div 
        onClick={() => onTabChange('chat')}
        className={clsx(
          'flex-1 flex items-center justify-center py-4 cursor-pointer transition-colors duration-300',
          activeTab === 'chat' ? 'text-primary-500' : 'text-gray-500 hover:bg-neutral-50'
        )}
      >
        <h3 className='font-medium'>Chat</h3>
      </div>
      <div 
        className={clsx(
          'absolute h-0.5 w-1/2 bg-primary-500 bottom-0 transition-all duration-300',
          activeTab === 'chat' ? 'translate-x-full' : 'translate-x-0'
        )}
      />
    </div>
  )
}

export default TabSelect