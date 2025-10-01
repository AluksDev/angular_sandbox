from django.conf import settings
from django.core import mail
from django.template import loader, Context, RequestContext


def render_content(template, context=None, request=None):
    """
    Render the content for an email from the template and context.
    The ".html" and ".txt" versions of the template must exist.
    Additionally, if the request is received, it will be used for rendering.
    """
    if context is None:
        context = {}

    if request:
        context_class = RequestContext(request, context)
    else:
        context_class = Context(context)
    return {
        "text_content": loader.get_template(u'{0}.txt'.format(template)).render(context_class.flatten()),
        "html_content": loader.get_template(u'{0}.html'.format(template)).render(context_class.flatten())
    }


def get_connection(smtp_config_name):
    """
    Returns the SMTP connection to be used, if necessary.
    It will be necessary to instantiate an SMTP connection if you receive the name of a
    SMTP configuration to be used of those defined in the settings (and this one exists).
    """
    try:
        smtp_config = settings.SMTP_CONFIG
    except AttributeError:
        smtp_config = None

    if smtp_config and smtp_config_name and smtp_config_name in smtp_config:
        use_tls = False
        use_ssl = False

        if "use_tls" in smtp_config[smtp_config_name]:
            use_tls = smtp_config[smtp_config_name]["use_tls"]

        if "use_ssl" in smtp_config[smtp_config_name]:
            use_ssl = smtp_config[smtp_config_name]["use_ssl"]

        connection = mail.get_connection(
            host=smtp_config[smtp_config_name]["host"],
            port=smtp_config[smtp_config_name]["port"],
            username=smtp_config[smtp_config_name]["username"],
            password=smtp_config[smtp_config_name]["password"],
            use_tls=use_tls, use_ssl=use_ssl, fail_silently=False)
    else:
        connection = mail.get_connection()

    return connection


def get_from_email(from_email_received, smtp_config_name):
    """
    Solve the "form_email" to use depending on the received.
    If one is received, that is used.
    If it is not received, the one defined by default is used in the settings or the one set
    for the corresponding SMTP configuration, if any are indicated.
    """

    if from_email_received:
        return from_email_received

    from_email = settings.DEFAULT_FROM_EMAIL

    try:
        smtp_config = settings.SMTP_CONFIG
    except AttributeError:
        smtp_config = None

    if smtp_config and smtp_config_name and smtp_config_name in smtp_config:
        if "from_email" in smtp_config[smtp_config_name]:
            from_email = smtp_config[smtp_config_name]["from_email"]

    return from_email


def get_email(to_email, subject, template, from_email=None, context=None, request=None, smtp_config_name=None, cc=None,
              bcc=None):
    """Instance an EmailMultiAlternative object from the received data."""

    if context is None:
        context = {}

    if not isinstance(to_email, list) and not isinstance(to_email, dict):
        to_email = [to_email]

    connection = get_connection(smtp_config_name)
    from_email_resolved = get_from_email(from_email, smtp_config_name)

    content = render_content(template, context, request)
    text_content = content["text_content"]
    html_content = content["html_content"]

    msg = mail.EmailMultiAlternatives(subject, text_content, from_email_resolved, to_email, connection=connection,
                                      cc=cc, bcc=bcc)
    msg.attach_alternative(html_content, "text/html")

    return msg


def get_email_from_content(to_email, subject, html_content, text_content, from_email=None, smtp_config_name=None,
                           cc=None, bcc=None):
    """
    Returns an instance of EmailMultiAlternatives instantiated being received
    the text of the email already rendered in the call to the function.
    """

    if not isinstance(to_email, list) and not isinstance(to_email, dict):
        to_email = [to_email]

    connection = get_connection(smtp_config_name)
    from_email_resolved = get_from_email(from_email, smtp_config_name)

    msg = mail.EmailMultiAlternatives(subject, text_content, from_email_resolved, to_email, connection=connection,
                                      cc=cc, bcc=bcc)
    msg.attach_alternative(html_content, "text/html")

    return msg


def send_email(to_email, subject, template, from_email=None, context=None, request=None, smtp_config_name=None, cc=None,
               bcc=None):
    """Sending an email"""

    if context is None:
        context = {}

    msg = get_email(to_email, subject, template, from_email, context, request, smtp_config_name, cc, bcc)
    msg.send()


def send_email_from_content(to_email, subject, html_content, text_content, from_email=None, smtp_config_name=None,
                            cc=None, bcc=None):
    msg = get_email_from_content(to_email, subject, html_content, text_content, from_email, smtp_config_name, cc, bcc)
    msg.send()


def send_emails(emails_config, smtp_config_name=None):
    """Sending several emails using a single connection."""

    if emails_config:
        connection = get_connection(smtp_config_name)
        emails = [get_email(**email_config) for email_config in emails_config]
        connection.send_messages(emails)
