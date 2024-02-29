import React from 'react'

export default function MailTab({from,subject,body,index}) {
  return (
    <div className={`mailTab mail${index}`}>
        <div className="mailSubject">{subject}</div>
        <div className="mailFrom">{from}</div>
    </div>
  )
}
