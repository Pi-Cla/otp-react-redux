import React, { Component } from 'react'
import { Badge } from 'react-bootstrap'
import styled from 'styled-components'

import Icon from '../narrative/icon'
import {
  Button,
  Full,
  Header
} from './styled'

const Quote = styled.p`
  font-size: small;
  margin-bottom: 5px;
`

const Footer = styled.footer`
  font-size: x-small;
`

const Note = ({note, onClickDelete}) => {
  return (
    <blockquote>
      <Quote>{note.note}</Quote>
      <button className='pull-right' onClick={() => onClickDelete(note)}>
        x
      </button>
      <Footer>{note.userName} on <em>{note.timeStamp}</em></Footer>
    </blockquote>
  )
}

const Feedback = ({feedback}) => {
  return (
    <blockquote>
      <Quote>{feedback.feedback}</Quote>
      <Footer>{feedback.userName} on <em>{feedback.timeStamp}</em></Footer>
    </blockquote>
  )
}
/**
 * Renders the various notes/feedback for a field trip request.
 */
export default class FieldTripNotes extends Component {
  _getNotesCount = () => {
    const {request} = this.props
    const {feedback, notes} = request
    let notesCount = 0
    if (notes && notes.length) notesCount += notes.length
    if (feedback && feedback.length) notesCount += feedback.length
    return notesCount
  }

  _addInternalNote = () => this._addNote('internal')

  _addOperationalNote = () => this._addNote('operational')

  _addNote = (type) => {
    const {addFieldTripNote, request} = this.props
    const note = prompt(`Type ${type} note to be attached to this request:`)
    if (note) addFieldTripNote(request, {note, type})
  }

  _deleteNote = (note) => {
    const {deleteFieldTripNote, request} = this.props
    if (confirm(`Are you sure you want to delete note: ${note.note}?`)) {
      console.log('OK deleting')
      deleteFieldTripNote(request, note.id)
    }
  }

  render () {
    const {expanded, onClickToggle, request} = this.props
    if (!request) return null
    const {
      feedback,
      notes
    } = request
    const internalNotes = []
    const operationalNotes = []
    notes && notes.forEach(note => {
      if (note.type === 'internal') internalNotes.push(note)
      else operationalNotes.push(note)
    })
    return (
      <Full>
        <Header>
          <Icon type='sticky-note-o' /> Notes/Feedback{' '}
          <Badge>{this._getNotesCount()}</Badge>
          <Button bsSize='xs' onClick={onClickToggle}>
            {expanded ? 'Hide' : 'Show'}
          </Button>
          <Button bsSize='xs' onClick={this._addInternalNote}>
            <Icon type='plus' /> Internal note
          </Button>
          <Button bsSize='xs' onClick={this._addOperationalNote}>
            <Icon type='plus' /> Ops. note
          </Button>
        </Header>
        {expanded &&
          <>
            <h5>User feedback</h5>
            {feedback && feedback.length > 0
              ? feedback.map((f, i) => <Feedback feedback={f} key={i} />)
              : 'No feedback submitted.'
            }
            <h5>Internal agent notes</h5>
            {internalNotes && internalNotes.length > 0
              ? internalNotes.map(n => <Note key={n.id} note={n} onClickDelete={this._deleteNote} />)
              : 'No internal notes submitted.'
            }
            <h5>Operational notes</h5>
            {operationalNotes && operationalNotes.length > 0
              ? operationalNotes.map(n => <Note key={n.id} note={n} onClickDelete={this._deleteNote} />)
              : 'No operational notes submitted.'
            }
          </>
        }
      </Full>
    )
  }
}