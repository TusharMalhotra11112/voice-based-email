import React from 'react'

export default function MailTab({from,subject,body}) {
  return (
    <div className="mailTab">
        <div className="mailSubject">{subject}</div>
        <div className="mailFrom">{from}</div>
    </div>
  )
}
