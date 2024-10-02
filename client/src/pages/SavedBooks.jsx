import { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client'; // Apollo Client hooks
import { GET_ME } from '../utils/queries'; // GraphQL query to get user data
import { REMOVE_BOOK } from '../utils/mutations'; // GraphQL mutation to remove book
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Fetch user data from the GET_ME query
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {}; // Get the user data or set as empty object

  // Create function that accepts the book's Mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use the removeBook mutation instead of the REST API
      await removeBook({
        variables: { bookId }, // Pass the bookId to the mutation
      });

      // Upon success, remove book's id from localStorage
      removeBookId(bookId);

      // Optionally, you could refetch user data here to update the UI
    } catch (err) {
      console.error(err);
    }
  };

  // If data isn't here yet, show loading
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;