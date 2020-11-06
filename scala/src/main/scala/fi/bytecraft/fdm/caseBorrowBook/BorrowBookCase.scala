package fi.bytecraft.fdm.caseBorrowBook

sealed trait Result[+T, +E]

case class Success[T, E](success: T) extends Result[T, E]
case class Failure[T, E](error: E) extends Result[T, E]

case class UnvalidatedUserId(id: Int)
case class UnvalidatedBookId(id: Int)
case class ValidUserId(id: Int)
case class ValidBookId(id: Int)

case class Borrowed(validUserId: ValidUserId, validBookId: ValidBookId)

sealed trait BorrowFailure

case class BookNotCurrentlyAvailable(validUserId: ValidUserId,
                                     validBookId: ValidBookId) extends BorrowFailure

case class BookNotFound(bookId: UnvalidatedBookId) extends BorrowFailure
case class UserNotFound(userId: UnvalidatedUserId) extends BorrowFailure

object BorrowBookCase {

  type ValidateUserId = (UnvalidatedUserId) => Option[ValidUserId]
  type ValidateBookId = (UnvalidatedBookId) => Option[ValidBookId]
  type MarkBookBorrowed = (ValidUserId, ValidBookId) => Option[Borrowed]

  type BorrowBook =
    (ValidateUserId, ValidateBookId, MarkBookBorrowed) => // dependencies
      (UnvalidatedUserId, UnvalidatedBookId) => Result[Borrowed, BorrowFailure]

  val borrowBook: BorrowBook = {
    (validateUserId, validateBookId, markBookBorrowed) => {
      (unvalidatedUserId, unvalidatedBookId) =>
        val validUserId = validateUserId(unvalidatedUserId)
        val validBookId = validateBookId(unvalidatedBookId)
        (validUserId, validBookId) match {
          case (Some(userId), Some(bookId)) => markBookBorrowed(userId, bookId) match {
            case Some(borrowed) => Success(borrowed)
            case None => Failure(BookNotCurrentlyAvailable(userId, bookId))
          }
          case (None, _) => Failure(UserNotFound(unvalidatedUserId))
          case (_, None) => Failure(BookNotFound(unvalidatedBookId))
        }
    }
  }
}
