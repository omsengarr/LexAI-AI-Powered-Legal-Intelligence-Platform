from datetime import datetime

from database import SessionLocal
from models import Case


LEGAL_CASES = [
    {
        "case_number": "1973 Supp SCR 1",
        "title": "His Holiness Kesavananda Bharati v State of Kerala",
        "court": "Supreme Court of India",
        "case_type": "Constitutional",
        "status": "Closed",
        "description": (
            "A landmark constitutional judgment concerning the extent "
            "of Parliament's power to amend the Constitution. The case "
            "is associated with the Basic Structure Doctrine, under which "
            "certain foundational features of the Constitution cannot be "
            "destroyed through the amendment power."
        ),
        "created_at": datetime(1973, 4, 24),
    },
    {
        "case_number": "1978 1 SCC 248",
        "title": "Maneka Gandhi v Union of India",
        "court": "Supreme Court of India",
        "case_type": "Constitutional / Fundamental Rights",
        "status": "Closed",
        "description": (
            "A seven-judge constitutional decision concerning Article 21 "
            "and personal liberty. The judgment held that a procedure "
            "interfering with personal liberty must satisfy applicable "
            "constitutional requirements, including scrutiny under "
            "Articles 14 and 19 where applicable."
        ),
        "created_at": datetime(1978, 1, 25),
    },
    {
        "case_number": "1997 6 SCC 241",
        "title": "Vishaka v State of Rajasthan",
        "court": "Supreme Court of India",
        "case_type": "Constitutional / Public Interest Litigation",
        "status": "Closed",
        "description": (
            "A public interest case concerning sexual harassment of women "
            "at the workplace. In the absence of specific legislation at "
            "the time, the Supreme Court laid down guidelines intended to "
            "prevent and address workplace sexual harassment."
        ),
        "created_at": datetime(1997, 8, 13),
    },
    {
        "case_number": "2017 10 SCC 1",
        "title": "Justice K.S. Puttaswamy (Retd.) v Union of India",
        "court": "Supreme Court of India",
        "case_type": "Constitutional / Fundamental Rights",
        "status": "Closed",
        "description": (
            "A nine-judge constitutional bench considered whether privacy "
            "is constitutionally protected. The judgment recognized privacy "
            "as a constitutionally protected right connected with liberty, "
            "dignity and individual autonomy, including protection under "
            "Article 21 and other fundamental rights."
        ),
        "created_at": datetime(2017, 8, 24),
    },
    {
        "case_number": "2017 9 SCC 1",
        "title": "Shayara Bano v Union of India",
        "court": "Supreme Court of India",
        "case_type": "Constitutional / Muslim Personal Law",
        "status": "Closed",
        "description": (
            "A constitutional challenge concerning the practice of "
            "Talaq-e-Bidaat, commonly known as instant triple talaq. "
            "The Constitution Bench considered the validity of the practice "
            "and set aside Talaq-e-Bidaat in its judgment."
        ),
        "created_at": datetime(2017, 8, 22),
    },
    {
        "case_number": "2018 10 SCC 1",
        "title": "Navtej Singh Johar v Union of India",
        "court": "Supreme Court of India",
        "case_type": "Constitutional / Criminal Law",
        "status": "Closed",
        "description": (
            "A constitutional challenge concerning Section 377 of the "
            "Indian Penal Code. The Supreme Court considered the application "
            "of constitutional guarantees including equality, dignity, "
            "privacy and personal liberty to consensual sexual acts between "
            "adults in private."
        ),
        "created_at": datetime(2018, 9, 6),
    },
]


def seed_cases():
    db = SessionLocal()

    inserted = 0
    skipped = 0

    try:
        for case_data in LEGAL_CASES:

            existing_case = (
                db.query(Case)
                .filter(
                    Case.case_number
                    == case_data["case_number"]
                )
                .first()
            )

            if existing_case:
                print(
                    f"SKIPPED: {case_data['title']}"
                )
                skipped += 1
                continue

            new_case = Case(
                case_number=case_data["case_number"],
                title=case_data["title"],
                court=case_data["court"],
                case_type=case_data["case_type"],
                description=case_data["description"],
                status=case_data["status"],
                created_at=case_data["created_at"],
            )

            db.add(new_case)

            print(
                f"ADDED: {case_data['title']}"
            )

            inserted += 1

        db.commit()

        print()
        print("========================================")
        print("LEGAL CASE SEEDING COMPLETED")
        print("========================================")
        print(f"Added : {inserted}")
        print(f"Skipped: {skipped}")
        print("========================================")

    except Exception as error:
        db.rollback()

        print()
        print("ERROR WHILE SEEDING CASES:")
        print(error)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_cases()