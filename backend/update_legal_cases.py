from database import SessionLocal
from models import Case


UPDATES = {
    "1973 Supp SCR 1": {
        "title": "His Holiness Kesavananda Bharati v State of Kerala",
        "description": (
            "A landmark constitutional judgment concerning the extent "
            "of Parliament's power to amend the Constitution. The case "
            "is associated with the Basic Structure Doctrine, under which "
            "certain foundational features of the Constitution cannot be "
            "destroyed through the amendment power."
        ),
    },
    "2017 10 SCC 1": {
        "title": "Justice K.S. Puttaswamy (Retd.) v Union of India",
        "description": (
            "A nine-judge constitutional bench considered whether privacy "
            "is constitutionally protected. The judgment recognized privacy "
            "as a constitutionally protected right connected with liberty, "
            "dignity and individual autonomy, including protection under "
            "Article 21 and other fundamental rights."
        ),
    },
    "2018 10 SCC 1": {
        "title": "Navtej Singh Johar v Union of India",
        "description": (
            "A constitutional challenge concerning Section 377 of the "
            "Indian Penal Code. The Supreme Court considered the application "
            "of constitutional guarantees including equality, dignity, "
            "privacy and personal liberty to consensual sexual acts between "
            "adults in private."
        ),
    },
}


def update_cases():
    db = SessionLocal()

    updated = 0
    not_found = 0

    try:
        for case_number, data in UPDATES.items():

            case = (
                db.query(Case)
                .filter(Case.case_number == case_number)
                .first()
            )

            if not case:
                print(f"NOT FOUND: {case_number}")
                not_found += 1
                continue

            case.title = data["title"]
            case.description = data["description"]

            print(f"UPDATED: {case.title}")
            updated += 1

        db.commit()

        print()
        print("========================================")
        print("LEGAL CASE UPDATE COMPLETED")
        print("========================================")
        print(f"Updated  : {updated}")
        print(f"Not Found: {not_found}")
        print("========================================")

    except Exception as error:
        db.rollback()

        print()
        print("ERROR WHILE UPDATING CASES:")
        print(error)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    update_cases()