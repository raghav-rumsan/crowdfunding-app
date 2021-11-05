import React from 'react';
import { Card, ProgressBar, ListGroup, ListGroupItem } from 'react-bootstrap';

export default function ProjectBox({ project }) {
    return (
        <>
            <Card.Body>
                {project && project.exists ? (
                    <span
                        className="btn btn-success"
                        style={{
                            position: 'absolute',
                            top: '7px',
                            left: '-10px',
                        }}
                    >
                        Open
                    </span>
                ) : (
                    <span
                        className="btn btn-danger"
                        style={{
                            position: 'absolute',
                            top: '7px',
                            left: '-10px',
                        }}
                    >
                        Closed
                    </span>
                )}
                <Card.Title>{project && project.name ? project.name.toString() : '-'}</Card.Title>
                <Card.Text>
                    <em>{project && project.desc ? project.desc.toString() : '0'}</em>
                </Card.Text>
                <ProgressBar animated now={project.percent} label={`${project.percent}%`} />
                <ListGroup className="list-group-flush">
                    <ListGroupItem>
                        {project && project.daysLeft && project.daysLeft >= 0
                            ? project.daysLeft
                            : '-'}
                        <em> Days Left</em>
                    </ListGroupItem>
                    <ListGroupItem>
                        Target/Collected:&nbsp;
                        {project && project.target && project.balance
                            ? `${window.web3.utils.fromWei(project.target, 'Ether')}
                        / ${String(window.web3.utils.fromWei(project.balance, 'Ether'))}`
                            : '-'}
                        <em> Ethers</em>
                    </ListGroupItem>
                    <ListGroupItem>
                        <small className="text-muted">
                            <em style={{ fontSize: '0.9em' }}>
                                Organized By: {project && project.owner ? project.owner : '-'}
                            </em>
                        </small>
                    </ListGroupItem>
                </ListGroup>
            </Card.Body>
        </>
    );
}