{isAdmin ? (
  <>
    {/* Admin-only buttons including Delete */}
    <Button onClick={() => onDelete(material.id)} ...>
      <Trash2 className="w-4 h-4" />
    </Button>
  </>
) : (
  <>
    {/* Non-admin: Only Reupload for pending materials */}
    {material.status === 'pending' && (
      <Button onClick={() => onOpenReupload(material)} ...>
        Reupload
      </Button>
    )}
  </>
)}