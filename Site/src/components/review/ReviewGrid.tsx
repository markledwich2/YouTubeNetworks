import { ChannelLogo } from '../channel/Channel'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { BasicChannel } from '../../common/YtApi'
import styled from 'styled-components'
import * as React from "react"
import _ from 'lodash'
import { tagOptions, LrTag, ChannelReview } from './ReviewCommon'
import { Tag } from '../Tag'
import { Button } from '../Button'
import { Edit as EditIcon } from '@styled-icons/material'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en')

const ReviewedTableStyle = styled.table`
  border-spacing: 1.5em;
  border-collapse: separate;

  th {
    text-align:left;
  }
  td {
    h4 {
      padding: 0.1em;
    }
  }
`

export const ReviewedGrid = ({ reviews, page, onEditReview, onShowMore, channels }:
  {
    reviews: ChannelReview[],
    page?: number,
    onEditReview: (c: ChannelReview) => void,
    onShowMore: () => void,
    channels: _.Dictionary<BasicChannel>
  }) => {

  page = page ?? 1
  const reviewsToDisplay = page * 200

  return <ReviewedTableStyle>
    <thead>
      <tr>
        <th></th>
        <th>L/R and Tags</th>
        <th>Notes</th>
        <th>Relevance</th>
      </tr>
    </thead>
    <tbody>
      {reviews && _(reviews).orderBy(r => r.review.Updated, 'desc').slice(0, reviewsToDisplay).value()
        .map(cr => {
          var c = cr.channel
          var r = cr.review
          return <tr key={`${r.ChannelId}|${r.Updated}`}>
            <td>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <ChannelLogo channelId={r.ChannelId} thumb={c?.LogoUrl} style={{ height: '50px', verticalAlign: 'middle', margin: '0 5px' }} />
                <div>
                  <h4>{c?.ChannelTitle ?? r.ChannelId}</h4>
                  <div>{timeAgo.format(Date.parse(r.Updated))}</div>
                  {r.MainChannelId ? <div> Main: <b>{channels[r.MainChannelId]?.ChannelTitle ?? r.MainChannelId}</b></div> : null}
                </div>
              </div>
            </td>
            <td>
              <div style={{ margin: '0.3em' }} ><LrTag tag={r.LR} /></div>
              <div>
                {_.uniq(r.SoftTags)
                  .map(t => tagOptions.find(o => o.value == t))
                  .filter(t => t)
                  .map(o => <Tag key={o.value} label={o.label} style={{ margin: '0.3em' }} />)}
              </div>
            </td>
            <td style={{ maxWidth: '20em' }}>{r?.Notes}</td>
            <td style={{ textAlign: 'right' }}>{r.Relevance}</td>
            <td><Button onclick={_ => onEditReview(cr)} icon={<EditIcon />} /></td>
          </tr>
        }
        )}
    </tbody>
    {reviewsToDisplay < reviews.length && <div><a onClick={() => onShowMore()}>show more reviews</a></div>}
  </ReviewedTableStyle>
}