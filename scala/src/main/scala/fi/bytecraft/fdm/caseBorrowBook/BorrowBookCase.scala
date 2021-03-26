package fi.bytecraft.fdm.caseBorrowBook

object BorrowBookCase {

  case class UnvalidatedUserId(id: Int)
  case class UnvalidatedBookId(id: Int)

  case class ValidUserId(id: Int)
  case class ValidBookId(id: Int)

  case class BorrowBook(unvalidatedBookId: UnvalidatedBookId, unvalidatedUserId: UnvalidatedUserId)

  sealed class Borrowed
  case class BookBorrowed(validUserId: ValidUserId, validBookId: ValidBookId) extends Borrowed()
  case class BookNotFound(bookId: UnvalidatedBookId) extends Borrowed()
  case class UserNotFound(userId: UnvalidatedUserId) extends Borrowed()
  case class BookNotCurrentlyAvailable(validUserId: ValidUserId, validBookId: ValidBookId) extends Borrowed()

  type ValidateUserId = (UnvalidatedUserId) => Option[ValidUserId]
  type ValidateBookId = (UnvalidatedBookId) => Option[ValidBookId]

  type MarkBookBorrowed = (ValidUserId, ValidBookId) => Option[BookBorrowed]

  type BorrowBookFlow =
    (ValidateUserId, ValidateBookId, MarkBookBorrowed) => // dependencies
      (BorrowBook) => Borrowed

  val borrowBook: BorrowBookFlow = {
    (validateUserId, validateBookId, markBookBorrowed) => {
      (borrowBook) =>
        val validUserId = validateUserId(borrowBook.unvalidatedUserId)
        val validBookId = validateBookId(borrowBook.unvalidatedBookId)
        (validUserId, validBookId) match {
          case (None, _) => UserNotFound(borrowBook.unvalidatedUserId)
          case (_, None) => BookNotFound(borrowBook.unvalidatedBookId)
          case (Some(userId), Some(bookId)) => markBookBorrowed(userId, bookId) match {
            case Some(borrowed) => borrowed
            case None => BookNotCurrentlyAvailable(userId, bookId)
          }
        }
    }
  }

}
